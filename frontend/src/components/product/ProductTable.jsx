import CustomTable from '../common/CustomTable';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct, fetchProducts } from '../../redux/product/productThunk';
import { ROUTES } from '../../routes/routes';
import { useEffect } from 'react';
import { Typography } from '@mui/material';
import { toast } from 'react-toastify';

const ProductTablePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { list, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteProduct(id)).unwrap();
      toast.success('Product deleted successfully!');
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  useEffect(() => {
    if (error) toast.error(error.message || error);
  }, [error]);

  const columns = [
    { accessorKey: 'product_id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'description', header: 'Description', showEllipsis: true },
    { accessorKey: 'qty', header: 'Qty' },
    { accessorKey: 'price', header: 'Price' },
  ];

  return (
    <>
      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      {list.length > 0 ? (
        <CustomTable
          data={list}
          columns={columns}
          searchEnabled={true}
          onEdit={(row) => navigate(ROUTES.PRODUCT.EDIT_FORM(row.product_id))}
          onDelete={(row) => handleDelete(row.product_id)}
          onView={(row) => navigate(ROUTES.PRODUCT.VIEW(row.product_id))}
        />
      ) : (
        <Typography>No products...</Typography>
      )}
    </>
  );
};

export default ProductTablePage;

// This is directly using the tanstack here.

// import { useCallback, useMemo } from 'react';
// import {
//   Box,
//   Button,
//   IconButton,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
// } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import {
//   useReactTable,
//   getCoreRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   flexRender,
// } from '@tanstack/react-table';
// import { useNavigate } from 'react-router-dom';
// import { ROUTES } from '../../routes/routes';
// import { useDispatch } from 'react-redux';
// import { deleteProduct } from '../../redux/product/productThunk';

// const ProductTable = ({ products }) => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   // Handling functions
//   const handleDelete = useCallback(
//     (product_id) => {
//       alert('Proceed to delete the product?');
//       dispatch(deleteProduct(product_id));
//     },
//     [dispatch],
//   );

//   const handleEdit = useCallback(
//     (product_id) => {
//       navigate(ROUTES.PRODUCT.EDIT_FORM(product_id));
//     },
//     [navigate],
//   );

//   // Defining columns
//   const columns = useMemo(
//     () => [
//       {
//         accessorKey: 'product_id',
//         header: 'ProductId',
//       },
//       {
//         accessorKey: 'name',
//         header: 'Name',
//       },
//       {
//         accessorKey: 'description',
//         header: 'Description',
//       },
//       {
//         accessorKey: 'qty',
//         header: 'Quantity',
//       },
//       {
//         accessorKey: 'price',
//         header: 'Price (₹)',
//       },
//       {
//         header: 'Actions',
//         id: 'actions',
//         cell: ({ row }) => {
//           return (
//             <>
//               <IconButton color="primary" onClick={() => handleEdit(row.original.product_id)}>
//                 <EditIcon />
//               </IconButton>

//               <IconButton color="error" onClick={() => handleDelete(row.original.product_id)}>
//                 <DeleteIcon />
//               </IconButton>
//             </>
//           );
//         },
//       },
//     ],
//     [handleDelete, handleEdit],
//   );

//   // Table initializations and features to add here.
//   const table = useReactTable({
//     data: products,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//   });

//   return (
//     <>
//       {/* Table */}
//       <TableContainer>
//         <Table>
//           <TableHead>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => (
//                   <TableCell
//                     key={header.id}
//                     onClick={header.column.getToggleSortingHandler()}
//                     sx={{ fontWeight: 600, cursor: 'pointer' }}
//                   >
//                     {flexRender(header.column.columnDef.header, header.getContext())}

//                     {/* Sorting Indicators */}
//                     {{
//                       asc: ' 🔼',
//                       desc: ' 🔽',
//                     }[header.column.getIsSorted()] ?? null}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))}
//           </TableHead>

//           <TableBody>
//             {table.getRowModel().rows.map((row) => (
//               <TableRow key={row.id}>
//                 {row.getVisibleCells().map((cell) => (
//                   <TableCell key={cell.id}>
//                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))}

//             {products.length === 0 && (
//               <TableRow>
//                 <TableCell colSpan={5} align="center">
//                   No products found.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Pagination */}
//       <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
//         <Button disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}>
//           Previous
//         </Button>

//         <Button disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>
//           Next
//         </Button>
//       </Box>
//     </>
//   );
// };

// export default ProductTable;
