// helpers/dbHelper.js
import pool from '../../config/database/connection.js';

/**
 * Comprehensive Database Helper for MySQL2 with Transaction Support
 */

/**
 * Get all records from a table (ONLY returns is_deleted = 0)
 * @param {Object} params - Query parameters
 * @param {Connection} connection - Optional database connection for transactions
 * @returns {Promise<Array|Boolean>} - Returns array of records or false on error
 */
const getAll = async (
  {
    table,
    selectColumns = ['*'],
    where = {},
    orderBy = [],
    joinArray = [],
    orLike = [],
    offset = 0,
    limit = 0,
    orWhere = [],
    whereIn = {},
    groupBy = [],
    whereNotIn = {},
    having = '',
    deletedColumn = 'is_deleted',
  },
  connection = null,
) => {
  try {
    // Validate required parameters
    if (!table) {
      throw new Error('Table name is required');
    }

    // ALWAYS add is_deleted = 0 filter
    const modifiedWhere = { ...where, [deletedColumn]: 0 };

    // Build SELECT clause
    const columns = Array.isArray(selectColumns) ? selectColumns.join(', ') : selectColumns;
    let sql = `SELECT ${columns} FROM ${table}`;

    // Add JOIN clauses
    if (joinArray && joinArray.length > 0) {
      joinArray.forEach((join) => {
        if (!join.table || !join.condition) {
          throw new Error('Join requires table and condition');
        }
        const joinType = join.join_type || 'INNER';
        sql += ` ${joinType} JOIN ${join.table} ON ${join.condition}`;
      });
    }

    // Build WHERE conditions
    const { whereClause, values } = buildWhereClause({
      where: modifiedWhere,
      orWhere,
      whereIn,
      whereNotIn,
      orLike,
    });

    if (whereClause) {
      sql += ` WHERE ${whereClause}`;
    }

    // Add GROUP BY
    if (groupBy && groupBy.length > 0) {
      sql += ` GROUP BY ${groupBy.join(', ')}`;
    }

    // Add HAVING clause
    if (having) {
      sql += ` HAVING ${having}`;
    }

    // Add ORDER BY
    if (orderBy && orderBy.length > 0) {
      const orderClauses = orderBy.map(({ key, value }) => {
        const direction = (value || 'ASC').toUpperCase();
        return `${key} ${direction}`;
      });
      sql += ` ORDER BY ${orderClauses.join(', ')}`;
    }

    // Add LIMIT and OFFSET
    if (limit > 0) {
      sql += ` LIMIT ? OFFSET ?`;
      values.push(limit, offset);
    }

    // Execute query with or without transaction
    const executor = connection || pool;
    const [rows] = await executor.query(sql, values);
    return rows;
  } catch (error) {
    console.error('Error in getAll:', error.message);
    return false;
  }
};

/**
 * Get a single record from a table (excludes soft-deleted records by default)
 * OPTIMIZED: Direct query instead of calling getAll
 * @param {Object} params - Query parameters
 * @param {Connection} connection - Optional database connection for transactions
 * @returns {Promise<Object|null|Boolean>} - Returns single record, null if not found, or false on error
 */
const getOne = async (
  {
    table,
    selectColumns = ['*'],
    where = {},
    joinArray = [],
    orderBy = [],
    groupBy = [],
    deletedColumn = 'is_deleted',
    primaryKey = null, // Optional: specify the primary key to check for null rows
  },
  connection = null,
) => {
  try {
    // Validate required parameters
    if (!table) {
      throw new Error('Table name is required');
    }

    if (!where || Object.keys(where).length === 0) {
      throw new Error('WHERE condition is required for getOne');
    }

    // Automatically exclude soft-deleted records
    const modifiedWhere = { ...where, [deletedColumn]: 0 };

    // Build SELECT clause
    const columns = Array.isArray(selectColumns) ? selectColumns.join(', ') : selectColumns;
    let sql = `SELECT ${columns} FROM ${table}`;

    // Add JOIN clauses
    if (joinArray && joinArray.length > 0) {
      joinArray.forEach((join) => {
        if (!join.table || !join.condition) {
          throw new Error('Join requires table and condition');
        }
        const joinType = join.join_type || 'INNER';
        sql += ` ${joinType} JOIN ${join.table} ON ${join.condition}`;
      });
    }

    // Build WHERE conditions
    const { whereClause, values } = buildWhereClause({
      where: modifiedWhere,
    });

    if (whereClause) {
      sql += ` WHERE ${whereClause}`;
    }

    // Add GROUP BY
    if (groupBy && groupBy.length > 0) {
      sql += ` GROUP BY ${Array.isArray(groupBy) ? groupBy.join(', ') : groupBy}`;
    }

    // Add ORDER BY
    if (orderBy && orderBy.length > 0) {
      const orderClauses = orderBy.map(({ key, value }) => {
        const direction = (value || 'ASC').toUpperCase();
        return `${key} ${direction}`;
      });
      sql += ` ORDER BY ${orderClauses.join(', ')}`;
    }

    // Add LIMIT 1 for single record
    sql += ` LIMIT 1`;

    // Execute query with or without transaction
    const executor = connection || pool;
    const [rows] = await executor.query(sql, values);

    // If no rows returned, return null
    if (rows.length === 0) {
      return null;
    }

    const row = rows[0];

    // CRITICAL FIX: Check if this is a "null row" from GROUP BY with no matches
    // This happens when using LEFT JOIN + GROUP BY and the main record doesn't exist
    // MySQL returns one row with all NULL values instead of no rows

    // Strategy 1: If primaryKey is provided, check if it's null
    if (primaryKey && row[primaryKey] === null) {
      return null;
    }

    // Strategy 2: If no primaryKey provided, check if the first WHERE condition key is null
    // This assumes the main table's identifier is in the WHERE clause
    if (!primaryKey) {
      const firstWhereKey = Object.keys(where)[0];
      if (firstWhereKey) {
        // Extract just the column name if it contains table alias (e.g., 'p.product_id' -> 'product_id')
        const columnName = firstWhereKey.includes('.')
          ? firstWhereKey.split('.').pop()
          : firstWhereKey;

        if (row[columnName] === null) {
          return null;
        }
      }
    }

    // Return the valid row
    return row;
  } catch (error) {
    console.error('Error in getOne:', error.message);
    return false;
  }
};

/**
 * Get all records including soft-deleted ones (returns is_deleted = 0 OR 1)
 * @param {Object} params - Query parameters
 * @param {Connection} connection - Optional database connection for transactions
 * @returns {Promise<Array|Boolean>} - Returns array of records or false on error
 */
const getAllWithDeleted = async (
  {
    table,
    selectColumns = ['*'],
    where = {},
    orderBy = [],
    joinArray = [],
    orLike = [],
    offset = 0,
    limit = 0,
    orWhere = [],
    whereIn = {},
    groupBy = [],
    whereNotIn = {},
    having = '',
  },
  connection = null,
) => {
  try {
    // Validate required parameters
    if (!table) {
      throw new Error('Table name is required');
    }

    // DO NOT add is_deleted filter - accept all records
    // Build SELECT clause
    const columns = Array.isArray(selectColumns) ? selectColumns.join(', ') : selectColumns;
    let sql = `SELECT ${columns} FROM ${table}`;

    // Add JOIN clauses
    if (joinArray && joinArray.length > 0) {
      joinArray.forEach((join) => {
        if (!join.table || !join.condition) {
          throw new Error('Join requires table and condition');
        }
        const joinType = join.join_type || 'INNER';
        sql += ` ${joinType} JOIN ${join.table} ON ${join.condition}`;
      });
    }

    // Build WHERE conditions (NO is_deleted filter)
    const { whereClause, values } = buildWhereClause({
      where,
      orWhere,
      whereIn,
      whereNotIn,
      orLike,
    });

    if (whereClause) {
      sql += ` WHERE ${whereClause}`;
    }

    // Add GROUP BY
    if (groupBy && groupBy.length > 0) {
      sql += ` GROUP BY ${groupBy.join(', ')}`;
    }

    // Add HAVING clause
    if (having) {
      sql += ` HAVING ${having}`;
    }

    // Add ORDER BY
    if (orderBy && orderBy.length > 0) {
      const orderClauses = orderBy.map(({ key, value }) => {
        const direction = (value || 'ASC').toUpperCase();
        return `${key} ${direction}`;
      });
      sql += ` ORDER BY ${orderClauses.join(', ')}`;
    }

    // Add LIMIT and OFFSET
    if (limit > 0) {
      sql += ` LIMIT ? OFFSET ?`;
      values.push(limit, offset);
    }

    // Execute query with or without transaction
    const executor = connection || pool;
    const [rows] = await executor.query(sql, values);
    return rows;
  } catch (error) {
    console.error('Error in getAllWithDeleted:', error.message);
    return false;
  }
};

/**
 * Get a single record including soft-deleted ones (returns is_deleted = 0 OR 1)
 * @param {Object} params - Query parameters
 * @param {Connection} connection - Optional database connection for transactions
 * @returns {Promise<Object|null|Boolean>} - Returns single record, null if not found, or false on error
 */
const getOneWithDeleted = async (
  {
    table,
    selectColumns = ['*'],
    where = {},
    joinArray = [],
    orderBy = [],
    groupBy = [],
    primaryKey = null,
  },
  connection = null,
) => {
  try {
    // Validate required parameters
    if (!table) {
      throw new Error('Table name is required');
    }

    if (!where || Object.keys(where).length === 0) {
      throw new Error('WHERE condition is required for getOneWithDeleted');
    }

    // DO NOT add is_deleted filter - accept all records
    // Build SELECT clause
    const columns = Array.isArray(selectColumns) ? selectColumns.join(', ') : selectColumns;
    let sql = `SELECT ${columns} FROM ${table}`;

    // Add JOIN clauses
    if (joinArray && joinArray.length > 0) {
      joinArray.forEach((join) => {
        if (!join.table || !join.condition) {
          throw new Error('Join requires table and condition');
        }
        const joinType = join.join_type || 'INNER';
        sql += ` ${joinType} JOIN ${join.table} ON ${join.condition}`;
      });
    }

    // Build WHERE conditions (NO is_deleted filter)
    const { whereClause, values } = buildWhereClause({
      where,
    });

    if (whereClause) {
      sql += ` WHERE ${whereClause}`;
    }

    // Add GROUP BY
    if (groupBy && groupBy.length > 0) {
      sql += ` GROUP BY ${Array.isArray(groupBy) ? groupBy.join(', ') : groupBy}`;
    }

    // Add ORDER BY
    if (orderBy && orderBy.length > 0) {
      const orderClauses = orderBy.map(({ key, value }) => {
        const direction = (value || 'ASC').toUpperCase();
        return `${key} ${direction}`;
      });
      sql += ` ORDER BY ${orderClauses.join(', ')}`;
    }

    // Add LIMIT 1 for single record
    sql += ` LIMIT 1`;

    // Execute query with or without transaction
    const executor = connection || pool;
    const [rows] = await executor.query(sql, values);

    // If no rows returned, return null
    if (rows.length === 0) {
      return null;
    }

    const row = rows[0];

    // Check if this is a "null row" from GROUP BY with no matches
    if (primaryKey && row[primaryKey] === null) {
      return null;
    }

    // Fallback: check first WHERE key
    if (!primaryKey) {
      const firstWhereKey = Object.keys(where)[0];
      if (firstWhereKey) {
        const columnName = firstWhereKey.includes('.')
          ? firstWhereKey.split('.').pop()
          : firstWhereKey;

        if (row[columnName] === null) {
          return null;
        }
      }
    }

    return row;
  } catch (error) {
    console.error('Error in getOneWithDeleted:', error.message);
    return false;
  }
};

/**
 * Create a single record
 * @param {string} table - Table name
 * @param {Object} data - Data to insert
 * @param {Connection} connection - Optional database connection for transactions
 * @returns {Promise<Object|Boolean>} - Returns inserted record info or false on error
 */
const createOne = async (table, data, connection = null) => {
  try {
    if (!table || !data || Object.keys(data).length === 0) {
      throw new Error('Table name and data are required');
    }

    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');

    const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;

    // Execute query with or without transaction
    const executor = connection || pool;
    const [result] = await executor.query(sql, values);

    return {
      success: true,
      insertId: result.insertId,
      affectedRows: result.affectedRows,
    };
  } catch (error) {
    console.error('Error in createOne:', error.message);
    return false;
  }
};

/**
 * Create multiple records in a single query
 * @param {string} table - Table name
 * @param {Array<Object>} dataArray - Array of data objects to insert
 * @param {Connection} connection - Optional database connection for transactions
 * @returns {Promise<Object|Boolean>} - Returns inserted records info or false on error
 */
const createMany = async (table, dataArray, connection = null) => {
  try {
    if (!table || !Array.isArray(dataArray) || dataArray.length === 0) {
      throw new Error('Table name and data array are required');
    }

    // Ensure all objects have the same keys
    const keys = Object.keys(dataArray[0]);
    const allKeysMatch = dataArray.every(
      (obj) => JSON.stringify(Object.keys(obj).sort()) === JSON.stringify(keys.sort()),
    );

    if (!allKeysMatch) {
      throw new Error('All objects must have the same keys');
    }

    const placeholders = dataArray.map(() => `(${keys.map(() => '?').join(', ')})`).join(', ');
    const values = dataArray.flatMap((obj) => keys.map((key) => obj[key]));

    const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES ${placeholders}`;

    // Execute query with or without transaction
    const executor = connection || pool;
    const [result] = await executor.query(sql, values);

    return {
      success: true,
      insertId: result.insertId,
      affectedRows: result.affectedRows,
    };
  } catch (error) {
    console.error('Error in createMany:', error.message);
    return false;
  }
};

/**
 * Update a single record (only updates non-deleted records by default)
 * @param {string} table - Table name
 * @param {Object} data - Data to update
 * @param {Object} where - WHERE conditions
 * @param {string} deletedColumn - Name of the soft delete column (default: 'is_deleted')
 * @param {Connection} connection - Optional database connection for transactions
 * @returns {Promise<Object|Boolean>} - Returns update info or false on error
 */
const updateOne = async (table, data, where, connection = null, deletedColumn = 'is_deleted') => {
  try {
    if (!table || !data || Object.keys(data).length === 0) {
      throw new Error('Table name and data are required');
    }

    if (!where || Object.keys(where).length === 0) {
      throw new Error('WHERE condition is required for updateOne');
    }

    // Only update non-deleted records
    const modifiedWhere = { ...where, [deletedColumn]: 0 };

    const setClause = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(', ');
    const setValues = Object.values(data);

    const { whereClause, values: whereValues } = buildWhereClause({ where: modifiedWhere });

    const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
    const values = [...setValues, ...whereValues];

    // Execute query with or without transaction
    const executor = connection || pool;
    const [result] = await executor.query(sql, values);

    return {
      success: result.affectedRows > 0,
      affectedRows: result.affectedRows,
      changedRows: result.changedRows,
    };
  } catch (error) {
    console.error('Error in updateOne:', error.message);
    return false;
  }
};

/**
 * Update multiple records with different values based on a key (only updates non-deleted records by default)
 * @param {string} table - Table name
 * @param {Array<Object>} dataArray - Array of objects with data to update
 * @param {string} whereKey - The key to match records (e.g., 'id')
 * @param {string} deletedColumn - Name of the soft delete column (default: 'is_deleted')
 * @param {Connection} connection - Optional database connection for transactions
 * @returns {Promise<Object|Boolean>} - Returns update info or false on error
 */
const updateMany = async (
  table,
  dataArray,
  whereKey,
  connection = null,
  deletedColumn = 'is_deleted',
) => {
  try {
    if (!table || !Array.isArray(dataArray) || dataArray.length === 0) {
      throw new Error('Table name and data array are required');
    }

    if (!whereKey) {
      throw new Error('whereKey is required for updateMany');
    }

    // Ensure all objects have the whereKey
    const allHaveKey = dataArray.every((obj) => obj.hasOwnProperty(whereKey));
    if (!allHaveKey) {
      throw new Error(`All objects must have the whereKey: ${whereKey}`);
    }

    const keys = Object.keys(dataArray[0]).filter((key) => key !== whereKey);
    const ids = dataArray.map((row) => row[whereKey]);
    const values = [];

    let sql = `UPDATE ${table} SET `;

    // Build CASE statements for each column
    keys.forEach((key, index) => {
      sql += `${key} = CASE `;
      dataArray.forEach((row) => {
        sql += `WHEN ${whereKey} = ? THEN ? `;
        values.push(row[whereKey], row[key]);
      });
      sql += `ELSE ${key} END`;

      if (index < keys.length - 1) {
        sql += ', ';
      }
    });

    // Only update non-deleted records
    sql += ` WHERE ${whereKey} IN (${ids.map(() => '?').join(', ')}) AND ${deletedColumn} = 0`;
    values.push(...ids);

    // Execute query with or without transaction
    const executor = connection || pool;
    const [result] = await executor.query(sql, values);

    return {
      success: result.affectedRows > 0,
      affectedRows: result.affectedRows,
      changedRows: result.changedRows,
    };
  } catch (error) {
    console.error('Error in updateMany:', error.message);
    return false;
  }
};

/**
 * Soft delete a single record (only soft-deletes non-deleted records)
 * @param {string} table - Table name
 * @param {Object} where - WHERE conditions
 * @param {string} deletedColumn - Name of the soft delete column (default: 'is_deleted')
 * @param {Connection} connection - Optional database connection for transactions
 * @returns {Promise<Object|Boolean>} - Returns update info or false on error
 */
const softDeleteOne = async (table, where, connection = null, deletedColumn = 'is_deleted') => {
  try {
    if (!table) {
      throw new Error('Table name is required');
    }

    if (!where || Object.keys(where).length === 0) {
      throw new Error('WHERE condition is required for softDeleteOne');
    }

    const data = { [deletedColumn]: 1 };

    // updateOne already checks for is_deleted = 0
    return await updateOne(table, data, where, connection, deletedColumn);
  } catch (error) {
    console.error('Error in softDeleteOne:', error.message);
    return false;
  }
};

/**
 * Soft delete multiple records (only soft-deletes non-deleted records)
 * @param {string} table - Table name
 * @param {Object} where - WHERE conditions
 * @param {string} deletedColumn - Name of the soft delete column (default: 'is_deleted')
 * @param {Connection} connection - Optional database connection for transactions
 * @returns {Promise<Object|Boolean>} - Returns update info or false on error
 */
const softDeleteMany = async (table, where, connection = null, deletedColumn = 'is_deleted') => {
  try {
    if (!table) {
      throw new Error('Table name is required');
    }

    if (!where || Object.keys(where).length === 0) {
      throw new Error('WHERE condition is required for softDeleteMany');
    }

    // Only soft-delete non-deleted records
    const modifiedWhere = { ...where, [deletedColumn]: 0 };

    const { whereClause, values: whereValues } = buildWhereClause({ where: modifiedWhere });
    const sql = `UPDATE ${table} SET ${deletedColumn} = 1 WHERE ${whereClause}`;

    // Execute query with or without transaction
    const executor = connection || pool;
    const [result] = await executor.query(sql, whereValues);

    return {
      success: result.affectedRows > 0,
      affectedRows: result.affectedRows,
      changedRows: result.changedRows,
    };
  } catch (error) {
    console.error('Error in softDeleteMany:', error.message);
    return false;
  }
};

/**
 * Hard delete a single record (only deletes non-deleted records by default)
 * @param {string} table - Table name
 * @param {Object} where - WHERE conditions
 * @param {Connection} connection - Optional database connection for transactions
 * @returns {Promise<Object|Boolean>} - Returns delete info or false on error
 */
const deleteOne = async (table, where, connection = null) => {
  try {
    if (!table) {
      throw new Error('Table name is required');
    }

    if (!where || Object.keys(where).length === 0) {
      throw new Error('WHERE condition is required for deleteOne');
    }

    // Only delete non-deleted records
    const modifiedWhere = { ...where };

    const { whereClause, values } = buildWhereClause({ where: modifiedWhere });
    const sql = `DELETE FROM ${table} WHERE ${whereClause} LIMIT 1`;

    // Execute query with or without transaction
    const executor = connection || pool;
    const [result] = await executor.query(sql, values);

    return {
      success: result.affectedRows > 0,
      affectedRows: result.affectedRows,
    };
  } catch (error) {
    console.error('Error in deleteOne:', error.message);
    return false;
  }
};

/**
 * Hard delete multiple records (only deletes non-deleted records by default)
 * @param {string} table - Table name
 * @param {Object} where - WHERE conditions
 * @param {Connection} connection - Optional database connection for transactions
 * @returns {Promise<Object|Boolean>} - Returns delete info or false on error
 */
const deleteMany = async (table, where, connection = null) => {
  try {
    if (!table) {
      throw new Error('Table name is required');
    }

    if (!where || Object.keys(where).length === 0) {
      throw new Error('WHERE condition is required for deleteMany');
    }

    // Only delete non-deleted records
    const modifiedWhere = { ...where };

    const { whereClause, values } = buildWhereClause({ where: modifiedWhere });
    const sql = `DELETE FROM ${table} WHERE ${whereClause}`;

    // Execute query with or without transaction
    const executor = connection || pool;
    const [result] = await executor.query(sql, values);

    return {
      success: result.affectedRows > 0,
      affectedRows: result.affectedRows,
    };
  } catch (error) {
    console.error('Error in deleteMany:', error.message);
    return false;
  }
};

/**
 * Build WHERE clause with multiple condition types
 * @param {Object} params - WHERE parameters
 * @returns {Object} - Returns whereClause string and values array
 */
const buildWhereClause = ({
  where = {},
  orWhere = [],
  whereIn = {},
  whereNotIn = {},
  orLike = [],
}) => {
  const conditions = [];
  const values = [];

  // Regular WHERE conditions
  for (const [key, value] of Object.entries(where)) {
    if (key.includes(' ')) {
      // Key contains operator (e.g., "age >")
      conditions.push(`${key} ?`);
    } else {
      // Handle NULL values
      if (value === null) {
        conditions.push(`${key} IS NULL`);
        continue;
      }
      conditions.push(`${key} = ?`);
    }
    values.push(value);
  }

  // OR WHERE conditions
  if (orWhere.length > 0) {
    const orConditions = orWhere.map(({ key, value }) => {
      if (value === null) {
        return `${key} IS NULL`;
      }
      values.push(value);
      return `${key} = ?`;
    });
    if (orConditions.length > 0) {
      conditions.push(`(${orConditions.join(' OR ')})`);
    }
  }

  // WHERE IN conditions
  for (const [key, valuesArray] of Object.entries(whereIn)) {
    if (Array.isArray(valuesArray) && valuesArray.length > 0) {
      conditions.push(`${key} IN (${valuesArray.map(() => '?').join(', ')})`);
      values.push(...valuesArray);
    }
  }

  // WHERE NOT IN conditions
  for (const [key, valuesArray] of Object.entries(whereNotIn)) {
    if (Array.isArray(valuesArray) && valuesArray.length > 0) {
      conditions.push(`${key} NOT IN (${valuesArray.map(() => '?').join(', ')})`);
      values.push(...valuesArray);
    }
  }

  // OR LIKE conditions
  if (orLike.length > 0) {
    const likeConditions = orLike.map(({ key }) => `${key} LIKE ?`);
    conditions.push(`(${likeConditions.join(' OR ')})`);
    values.push(...orLike.map(({ value }) => `%${value}%`));
  }

  const whereClause = conditions.length > 0 ? conditions.join(' AND ') : '';
  return { whereClause, values };
};

/**
 * Execute a raw SQL query (use with caution)
 * @param {string} sql - SQL query
 * @param {Array} values - Query parameters
 * @param {Connection} connection - Optional database connection for transactions
 * @returns {Promise<Array|Boolean>} - Returns query result or false on error
 */
const rawQuery = async (sql, values = [], connection = null) => {
  try {
    // Execute query with or without transaction
    const executor = connection || pool;
    const [rows] = await executor.query(sql, values);
    return rows;
  } catch (error) {
    console.error('Error in rawQuery:', error.message);
    return false;
  }
};

/**
 * Begin a transaction
 * @returns {Promise<Connection|Boolean>} - Returns connection or false on error
 */
const beginTransaction = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    return connection;
  } catch (error) {
    console.error('Error in beginTransaction:', error.message);
    return false;
  }
};

/**
 * Commit a transaction
 * @param {Connection} connection - Database connection
 * @returns {Promise<Boolean>} - Returns true on success, false on error
 */
const commitTransaction = async (connection) => {
  try {
    await connection.commit();
    connection.release();
    return true;
  } catch (error) {
    console.error('Error in commitTransaction:', error.message);
    return false;
  }
};

/**
 * Rollback a transaction
 * @param {Connection} connection - Database connection
 * @returns {Promise<Boolean>} - Returns true on success, false on error
 */
const rollbackTransaction = async (connection) => {
  try {
    await connection.rollback();
    connection.release();
    return true;
  } catch (error) {
    console.error('Error in rollbackTransaction:', error.message);
    return false;
  }
};

export default {
  getAll,
  getOne,
  getAllWithDeleted,
  getOneWithDeleted,
  createOne,
  createMany,
  updateOne,
  updateMany,
  deleteOne,
  deleteMany,
  softDeleteOne,
  softDeleteMany,
  rawQuery,
  beginTransaction,
  commitTransaction,
  rollbackTransaction,
};
