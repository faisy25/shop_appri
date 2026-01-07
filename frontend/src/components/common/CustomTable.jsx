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
  Tooltip,
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

  // Helper function to truncate text
  const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    const textStr = String(text);
    if (textStr.length <= maxLength) return textStr;
    return textStr.substring(0, maxLength) + '...';
  };

  // Process columns to add ellipsis and tooltip for columns with showEllipsis: true
  const processedColumns = useMemo(() => {
    return columns.map((column) => {
      // Check if column has showEllipsis prop set to true
      if (!column.showEllipsis) {
        return column;
      }

      // If column already has a custom cell renderer, wrap it with ellipsis logic
      if (column.cell) {
        const originalCell = column.cell;
        return {
          ...column,
          cell: ({ row }) => {
            const cellValue = originalCell({ row });
            const value = row.original[column.accessorKey];
            const fullText = value || '';

            // Only show tooltip if text is truncated
            if (fullText.length > 50) {
              return (
                <Tooltip title={fullText} arrow placement="top">
                  <Box
                    sx={{
                      maxWidth: '300px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      cursor: 'help',
                    }}
                  >
                    {cellValue}
                  </Box>
                </Tooltip>
              );
            }
            return <Box>{cellValue}</Box>;
          },
        };
      }

      // Add truncation and tooltip for columns without custom cell renderer
      return {
        ...column,
        cell: ({ row }) => {
          const value = row.original[column.accessorKey];
          const fullText = value || '';
          const truncatedText = truncateText(fullText);

          // Only show tooltip if text is truncated
          if (fullText.length > 50) {
            return (
              <Tooltip title={fullText} arrow placement="top">
                <Box
                  sx={{
                    maxWidth: '300px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    cursor: 'help',
                  }}
                >
                  {truncatedText}
                </Box>
              </Tooltip>
            );
          }

          return <Box>{fullText}</Box>;
        },
      };
    });
  }, [columns]);

  // Add actions column automatically if enabled
  const finalColumns = useMemo(() => {
    if (!actions) return processedColumns;

    return [
      ...processedColumns,
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
  }, [processedColumns, onEdit, onDelete, onView, actions]);

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
            slotProps={{
              inputLabel: {
                sx: { 
                  zIndex: 1,
                  '&.MuiInputLabel-shrink': {
                    zIndex: 2,
                    backgroundColor: 'background.paper',
                    padding: '0 4px',
                  },
                },
              },
            }}
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
