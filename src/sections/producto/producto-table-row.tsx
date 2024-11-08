import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type ProductoProps = {
  id: string;
  nombre: string;
  cantidad: number;
  unitOfMeasure: number,
  cost: number,
  price: number,
  category: string,
  totalPrice: number,
  totalCost: number,
  totalProfit: number,
};

type ProductoTableRowProps = {
  row: ProductoProps;
  selected: boolean;
  onSelectRow: () => void;
};

export function ProductoTableRow({ row, selected, onSelectRow }: ProductoTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row">
          {row.nombre}
        </TableCell>

        <TableCell component="th" scope="row">
          {row.cantidad}
        </TableCell>

        <TableCell component="th" scope="row">
          {row.unitOfMeasure}
        </TableCell>

        <TableCell component="th" scope="row">
          {row.cost}
        </TableCell>

        <TableCell component="th" scope="row">
          {row.price}
        </TableCell>

        <TableCell component="th" scope="row">
          {row.category}
        </TableCell>

        <TableCell component="th" scope="row">
          {row.totalPrice}
        </TableCell>

        <TableCell component="th" scope="row">
          {row.totalCost}
        </TableCell>

        <TableCell component="th" scope="row">
          {row.totalProfit}
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={handleClosePopover}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={handleClosePopover} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
