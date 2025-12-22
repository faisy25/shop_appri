import dbHelper from '../../util/database/dbHelper.js';
import ApiError from '../../util/error/api.error.js';
import { ServiceError } from '../../util/error/service.error.js';
import { mediaService } from '../media/media.service.js';

export const productService = {
  async getAll() {
    try {
      const products = await dbHelper.getAll({
        table: 'product p',
        selectColumns: [
          'p.*',
          `COALESCE(
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'media_id', m.media_id,
              'media_type', m.media_type,
              'media_url', m.media_url,
              'model_type', m.model_type,
              'public_id', m.public_id,
              'folder_path', m.folder_path,
              'is_primary', m.is_primary,
              'sort_order', m.sort_order
            )
          ), JSON_ARRAY()
        ) AS media`,
        ],
        joinArray: [
          {
            table: 'media m',
            condition: `m.model_id = p.product_id 
                      AND m.model_type = 'product'
                      AND m.is_deleted = 0`,
            join_type: 'LEFT',
          },
        ],
        groupBy: ['p.product_id'],
        orderBy: [{ key: 'p.product_id', value: 'DESC' }],
        deletedColumn: 'p.is_deleted', // This should be added to check which is_deleted value it should consider.
      });

      const parsed = products.map((p) => ({
        ...p,
        media: JSON.parse(p.media),
      }));

      return parsed;
    } catch (err) {
      ServiceError(err, 'Failed to load products');
    }
  },

  async getById(id) {
    try {
      const product = await dbHelper.getOne({
        table: 'product p',
        where: { product_id: id },
        selectColumns: [
          'p.*',
          `COALESCE(
            JSON_ARRAYAGG(
              JSON_OBJECT(
              'media_id', m.media_id,
              'media_type', m.media_type,
              'media_url', m.media_url,
              'model_type', m.model_type,
              'public_id', m.public_id,
              'folder_path', m.folder_path,
              'is_primary', m.is_primary,
              'sort_order', m.sort_order
              )
            ), JSON_ARRAY()
          ) AS media`,
        ],
        joinArray: [
          {
            table: 'media m',
            condition: `m.model_id = p.product_id
                      AND m.model_type = 'product'
                      AND m.is_deleted = 0`,
            join_type: 'LEFT',
          },
        ],
        groupBy: 'p.product_id',
        deletedColumn: 'p.is_deleted', // This should be added to check which is_deleted value it should consider.
      });

      if (!product) {
        throw new ApiError(404, 'Product not found');
      }

      const parsed = {
        ...product,
        media: JSON.parse(product.media),
      };

      return parsed;
    } catch (err) {
      ServiceError(err, 'Failed to get product');
    }
  },

  async create(data) {
    const connection = await dbHelper.beginTransaction();
    // Add check for connection
    if (!connection) {
      throw new ApiError(500, 'Failed to start transaction');
    }

    try {
      const { files, ...product } = data;

      // Uses transaction connection
      const result = await dbHelper.createOne(
        'product',
        {
          name: product.name,
          description: product.description,
          qty: product.qty,
          price: product.price,
        },
        connection,
      ); // Pass connection here

      if (!result || result === false) {
        throw new ApiError(500, 'Failed to create product');
      }

      const productId = result.insertId;

      // Media service can also use the connection
      const mediaInsertResult = await mediaService.create(
        {
          model_type: 'product',
          model_id: productId,
          files,
        },
        connection, // Pass connection here
      );

      // Only commit if everything succeeded
      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return {
        product_id: productId,
        uploaded_media_count: mediaInsertResult.inserted_count,
      };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to create product');
    }
  },

  async update(id, data) {
    const connection = await dbHelper.beginTransaction();
    if (!connection) {
      throw new ApiError(500, 'Failed to start transaction');
    }

    try {
      // First check if product exists and is not deleted
      const product = await this.getById(id);

      // Extract files from data (if any new files to upload)
      const { files, ...productData } = data;

      // 1. Update product basic info
      const result = await dbHelper.updateOne(
        'product',
        {
          name: productData.name,
          description: productData.description,
          qty: productData.qty,
          price: productData.price,
        },
        { product_id: id },
        connection,
      );

      if (!result) {
        throw new ApiError(404, 'Product not found');
      }

      // 2. Handle new media uploads (if any)
      let uploadedCount = 0;
      if (files && files.length > 0) {
        const mediaInsertResult = await mediaService.create(
          {
            model_type: 'product',
            model_id: id,
            files,
          },
          connection,
        );
        uploadedCount = mediaInsertResult.inserted_count;
      }

      // Commit transaction
      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return {
        product_id: id,
        uploaded_media_count: uploadedCount,
      };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to update product');
    }
  },

  async softDelete(id) {
    const connection = await dbHelper.beginTransaction();

    if (!connection) {
      throw new ApiError(500, 'Failed to start transaction');
    }

    try {
      // First check if product exists and is not deleted
      await this.getById(id);

      // Soft delete all media associated with this product
      const mediaDeleteResult = await mediaService.softDelete(
        {
          model_type: 'product',
          model_id: id, // Fixed: was productId, should be id
        },
        connection, // Pass connection for transaction
      );

      // Then soft delete the product itself
      const result = await dbHelper.softDeleteOne(
        'product',
        { product_id: id },
        connection, // Pass connection here too
      );

      if (!result || !result.success || result.affectedRows === 0) {
        throw new ApiError(404, 'Product not found or already deleted');
      }

      // Only commit if everything succeeded
      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return {
        product_id: id,
      };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to delete product');
    }
  },

  // For Deleted Permanently.
  async getAllWithDeleted() {
    try {
      const products = await dbHelper.getAllWithDeleted({
        table: 'product p',
        selectColumns: [
          'p.*',
          `COALESCE(
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'media_id', m.media_id,
              'media_type', m.media_type,
              'media_url', m.media_url,
              'model_type', m.model_type,
              'public_id', m.public_id,
              'folder_path', m.folder_path,
              'is_primary', m.is_primary,
              'sort_order', m.sort_order
            )
          ), JSON_ARRAY()
        ) AS media`,
        ],
        joinArray: [
          {
            table: 'media m',
            condition: `m.model_id = p.product_id 
                      AND m.model_type = 'product'
                      AND m.is_deleted = 0`,
            join_type: 'LEFT',
          },
        ],
        groupBy: ['p.product_id'],
        orderBy: [{ key: 'p.product_id', value: 'DESC' }],
      });

      const parsed = products.map((p) => ({
        ...p,
        media: JSON.parse(p.media),
      }));

      return parsed;
    } catch (err) {
      ServiceError(err, 'Failed to load products with deleted');
    }
  },

  async getByIdWithDeleted(id) {
    try {
      const product = await dbHelper.getOneWithDeleted({
        table: 'product p',
        where: { 'p.product_id': id },
        selectColumns: [
          'p.*',
          `COALESCE(
          JSON_ARRAYAGG(
            JSON_OBJECT(
            'media_id', m.media_id,
            'media_type', m.media_type,
            'media_url', m.media_url,
            'model_type', m.model_type,
            'public_id', m.public_id,
            'folder_path', m.folder_path,
            'is_primary', m.is_primary,
            'sort_order', m.sort_order
            )
          ), JSON_ARRAY()
        ) AS media`,
        ],
        joinArray: [
          {
            table: 'media m',
            condition: `m.model_id = p.product_id
                    AND m.model_type = 'product'`,
            // Note: Removed is_deleted check to get ALL media (deleted or not)
            join_type: 'LEFT',
          },
        ],
        groupBy: ['p.product_id'],
        primaryKey: 'product_id',
        // deletedColumn is not needed - skipDeletedCheck is automatically set to true
      });

      if (!product) {
        throw new ApiError(404, 'Product not found');
      }

      const parsed = {
        ...product,
        media: JSON.parse(product.media),
      };

      return parsed;
    } catch (err) {
      ServiceError(err, 'Failed to get product with deleted records');
    }
  },

  async hardDelete(id) {
    const connection = await dbHelper.beginTransaction();
    if (!connection) {
      throw new ApiError(500, 'Failed to start transaction');
    }

    try {
      // Get product with ALL media (including deleted ones) before deletion
      const product = await this.getByIdWithDeleted(id);

      // Extract media array for Cloudinary deletion
      const mediaItems = product.media || [];

      // Hard delete all media from database
      if (mediaItems.length > 0) {
        const mediaDeleteResult = await mediaService.hardDelete(
          {
            model_type: 'product',
            model_id: id,
          },
          mediaItems, // Pass media items for Cloudinary deletion
          connection,
        );

        if (!mediaDeleteResult) {
          throw new ApiError(500, 'Failed to delete media');
        }
      }

      // Hard delete the product from database
      const result = await dbHelper.deleteOne(
        'product',
        { product_id: id },
        connection, // Pass connection for transaction
      );

      if (!result || !result.success || result.affectedRows === 0) {
        throw new ApiError(404, 'Product not found or already deleted');
      }

      // Only commit if everything succeeded
      const committed = await dbHelper.commitTransaction(connection);
      if (!committed) {
        throw new ApiError(500, 'Failed to commit transaction');
      }

      return {
        product_id: id,
        deleted_media_count: mediaItems.length,
      };
    } catch (err) {
      await dbHelper.rollbackTransaction(connection);
      ServiceError(err, 'Failed to permanently delete product');
    }
  },
};

// OLD CODE FOR REFERENCE WITH DB HELPER.
// import connection from '../../config/database/connection.js';
// import ApiError from '../../util/error/api.error.js';
// import { ServiceError } from '../../util/error/service.error.js';

// export const productService = {
//   async getAll() {
//     try {
//       const [rows] = await connection.query('SELECT * FROM product');

//       return rows;
//     } catch (err) {
//       ServiceError(err, 'Failed to load products');
//     }
//   },

//   async getById(id) {
//     try {
//       const [rows] = await connection.query('SELECT * FROM product WHERE product_id = ?', [id]);
//       const product = rows[0];
//       if (!product) throw new ApiError(404, 'Product not found');
//       return product;
//     } catch (err) {
//       ServiceError(err, 'Failed to get product');
//     }
//   },

//   async create(data) {
//     try {
//       const sql = 'INSERT INTO product (name, description, qty, price) VALUES (?, ?, ?, ?)';
//       const values = [data.name, data.description, data.qty, data.price];

//       const [result] = await connection.query(sql, values);
//       return result.insertId;
//     } catch (err) {
//       ServiceError(err, 'Failed to create product');
//     }
//   },

//   async update(id, data) {
//     try {
//       await this.getById(id); // ensures existence

//       const sql = `
//         UPDATE product
//         SET name = ?, description = ?, qty = ?, price = ?
//         WHERE product_id = ?
//       `;

//       await connection.query(sql, [data.name, data.description, data.qty, data.price, id]);

//       return id;
//     } catch (err) {
//       ServiceError(err, 'Failed to update product');
//     }
//   },

//   async delete(id) {
//     try {
//       await this.getById(id); // ensures existence

//       await connection.query('DELETE FROM product WHERE product_id = ?', [id]);

//       return id;
//     } catch (err) {
//       ServiceError(err, 'Failed to delete product');
//     }
//   },
// };
