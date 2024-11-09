import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuList from '@mui/material/MenuList';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type SaleProps = {
  id: string;
  name: string;
  clientType: string;
  region: string;
  city: string;
  zone: string;
  contact: string;
  customerSegment: string;
};

type SaleTableRowProps = {
  row: SaleProps;
  selected: boolean;
  onSelectRow: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function ClientTableRow({ row, selected, onSelectRow, onEdit, onDelete }: SaleTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected} onClick={onSelectRow}>
        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            {row.name}
          </Box>
        </TableCell>

        <TableCell>{row.clientType}</TableCell>
        <TableCell>{row.region}</TableCell>
        <TableCell>{row.city}</TableCell>
        <TableCell>{row.zone}</TableCell>
        <TableCell>{row.contact}</TableCell>
        <TableCell>{row.customerSegment}</TableCell>

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
          <MenuItem onClick={() => { onEdit(); handleClosePopover(); }}>
            <Iconify icon="solar:pen-bold" />
            Editar
          </MenuItem>
          <MenuItem onClick={() => { onDelete(); handleClosePopover(); }} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Eliminar
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
