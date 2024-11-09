import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData } from '../table-no-data';
import { SaleTableRow } from '../sale-table-row';
import { ProductTableHead } from '../sale-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { SaleTableToolbar } from '../sale-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import { useTable } from '../use-table';

export type SaleProps = {
  id: string;
  client: {
    id: string;
    name: string;
  };
  product: {
    id: string;
    name: string;
  };
  quantity: number;
  totalAmount: number;
};

type Client = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
};


export function SaleView() {
  const table = useTable();
  const [sales, setSales] = useState<SaleProps[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filterName, setFilterName] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);
  const [newSale, setNewSale] = useState<SaleProps>({
    id: '',
    client: { id: '', name: '' },
    product: { id: '', name: '' },
    quantity: 0,
    totalAmount: 0,
  });

  const handleOpenDrawer = () => setDrawerOpen(true);
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setIsEditing(false);
    setSelectedSaleId(null);
    setNewSale({
      id: '',
      client: { id: '', name: '' },
      product: { id: '', name: '' },
      quantity: 0,
      totalAmount: 0,
    });
  };

  const handleSaveSale = async () => {
    if (isEditing) {
      await handleUpdateSale();
    } else {
      await handleCreateSale();
    }
  };

  const handleCreateSale = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.post(
          'https://backend-ayni.azurewebsites.net/api/sales/create',
          {
            clientId: newSale.client.id,
            productId: newSale.product.id,
            quantity: newSale.quantity,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        setSales([...sales, response.data]);
        handleCloseDrawer();
      } catch (error) {
        console.error('Error creating sale:', error);
      }
    }
  };

  const handleUpdateSale = async () => {
    const token = localStorage.getItem('token');
    if (token && selectedSaleId) {
      try {
        const response = await axios.put(
          `https://backend-ayni.azurewebsites.net/api/sales/update/${selectedSaleId}`,
          {
            clientId: newSale.client.id,
            productId: newSale.product.id,
            quantity: newSale.quantity,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        setSales(sales.map((sale) =>
          sale.id === selectedSaleId ? response.data : sale
        ));
        handleCloseDrawer();
      } catch (error) {
        console.error('Error updating sale:', error);
      }
    }
  };

  const handleEdit = (sale: SaleProps) => {
    setSelectedSaleId(sale.id);
    setIsEditing(true);
    setNewSale(sale);
    handleOpenDrawer();
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await axios.delete(`https://backend-ayni.azurewebsites.net/api/sales/delete/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSales(sales.filter((sale) => sale.id !== id));
      } catch (error) {
        console.error('Error deleting sale:', error);
      }
    }
  };

  useEffect(() => {
    const fetchSales = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('https://backend-ayni.azurewebsites.net/api/sales', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setSales(response.data);
        } catch (error) {
          console.error('Error fetching sales:', error);
        }
      }
    };

    const fetchClients = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('https://backend-ayni.azurewebsites.net/api/clients', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setClients(response.data);
        } catch (error) {
          console.error('Error fetching clients:', error);
        }
      }
    };

    const fetchProducts = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('https://backend-ayni.azurewebsites.net/api/products', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setProducts(response.data);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      }
    };

    fetchSales();
    fetchClients();
    fetchProducts();
  }, []);

  const dataFiltered = applyFilter({
    inputData: sales,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Ventas
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => {
            setIsEditing(false);
            handleOpenDrawer();
          }}
        >
          Nueva Venta
        </Button>
      </Box>

      <Card>
        <SaleTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <ProductTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={sales.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    sales.map((sale) => sale.id)
                  )
                }
                headLabel={[
                  { id: 'clientId', label: 'RUC / DNI' },
                  { id: 'clientName', label: 'Nombre Cliente' },
                  { id: 'productName', label: 'Producto' },
                  { id: 'quantity', label: 'Cantidad' },
                  { id: 'totalAmount', label: 'Monto Total' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <SaleTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onEdit={() => handleEdit(row)}
                      onDelete={() => handleDelete(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, sales.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={sales.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      <Drawer anchor="right" open={drawerOpen} onClose={handleCloseDrawer}>
        <Box p={3} width={300} role="presentation">
          <Typography variant="h6" gutterBottom>
            {isEditing ? 'Actualizar Venta' : 'Nueva Venta'}
          </Typography>
          <Autocomplete
            options={clients}
            getOptionLabel={(option) => option.name}
            value={clients.find((client) => client.id === newSale.client.id) || null} // Set selected client
            onChange={(event, value) => setNewSale({
              ...newSale,
              client: { id: value?.id || '', name: value?.name || '' },
            })}
            renderInput={(params) => <TextField {...params} label="Nombre Cliente" margin="normal" fullWidth />}
          />
          <Autocomplete
            options={products}
            getOptionLabel={(option) => option.name}
            value={products.find((product) => product.id === newSale.product.id) || null} // Set selected product
            onChange={(event, value) => setNewSale({
              ...newSale,
              product: { id: value?.id || '', name: value?.name || '' },
            })}
            renderInput={(params) => <TextField {...params} label="Producto" margin="normal" fullWidth />}
          />
          <TextField
            label="Cantidad"
            fullWidth
            margin="normal"
            type="number"
            value={newSale.quantity}
            onChange={(e) => setNewSale({ ...newSale, quantity: parseInt(e.target.value, 10) })}
          />
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button variant="contained" onClick={handleSaveSale}>
              {isEditing ? 'Actualizar' : 'Guardar'}
            </Button>
          </Box>
        </Box>
      </Drawer>
    </DashboardContent>
  );
}
