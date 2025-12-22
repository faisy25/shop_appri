import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const CustomTable = ({
  data = [],
  columns = [],
  onEdit,
  onDelete,
  onView,
  searchEnabled = false,
  pageSize = 10,
  actions = true,
}) => {
  const [search, setSearch] = useState('');

  // 🔎 Filter rows based on search text
  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((row) =>
      Object.values(row).some((val) => String(val).toLowerCase().includes(search.toLowerCase())),
    );
  }, [search, data]);

  // Add actions column automatically if enabled
  const finalColumns = useMemo(() => {
    if (!actions) return columns;

    return [
      ...columns,
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <Box display="flex" gap={1}>
            {onView && (
              <IconButton onClick={() => onView(row.original)} color="info">
                <VisibilityIcon />
              </IconButton>
            )}
            {onEdit && (
              <IconButton onClick={() => onEdit(row.original)} color="primary">
                <EditIcon />
              </IconButton>
            )}
            {onDelete && (
              <IconButton onClick={() => onDelete(row.original)} color="error">
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        ),
      },
    ];
  }, [columns, onEdit, onDelete, onView, actions]);

  // Define TanStack Table
  const table = useReactTable({
    data: filteredData,
    columns: finalColumns,
    initialState: {
      pagination: { pageSize },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Box width="100%">
      {/* 🔎 Search */}
      {searchEnabled && (
        <Box mb={2} display="flex" justifyContent="flex-end">
          <TextField
            label="Search..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Box>
      )}

      {/* 📊 Table */}
      <TableContainer>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    sx={{ fontWeight: 600, cursor: 'pointer' }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: ' 🔼',
                      desc: ' 🔽',
                    }[header.column.getIsSorted()] || ''}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>

          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}

            {filteredData.length === 0 && (
              <TableRow>
                <TableCell colSpan={finalColumns.length} align="center">
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 📄 Pagination */}
      <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
        <Button disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}>
          Previous
        </Button>
        <Button disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default CustomTable;
