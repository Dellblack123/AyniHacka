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

import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData } from '../table-no-data';
import { ProductTableRow } from '../product-table-row';
import { ProductTableHead } from '../product-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { ClienteTableToolbar } from '../product-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { ProductProps } from '../product-table-row';
import { useTable } from '../use-table';

export function ProductView() {
  const table = useTable();
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [filterName, setFilterName] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    quantity: 0,
    unitOfMeasure: '',
    cost: 0,
    price: 0,
    category: '',
  });

  // Función para abrir el drawer
  const handleOpenDrawer = () => setDrawerOpen(true);
  // Función para cerrar el drawer
  const handleCloseDrawer = () => setDrawerOpen(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('https://backend-ayni.azurewebsites.net/api/products', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setProducts(response.data);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      }
    };
    fetchProducts();
  }, []);

  const dataFiltered = applyFilter({
    inputData: products,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Productos
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleOpenDrawer}
        >
          Nuevo Producto
        </Button>
      </Box>

      <Card>
        <ClienteTableToolbar
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
                rowCount={products.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    products.map((product) => product.id)
                  )
                }
                headLabel={[
                  { id: 'name', label: 'Nombre' },
                  { id: 'quantity', label: 'Cantidad' },
                  { id: 'unitOfMeasure', label: 'Unidad' },
                  { id: 'cost', label: 'Costo' },
                  { id: 'price', label: 'Precio' },
                  { id: 'category', label: 'Categoría' },
                  { id: 'totalPrice', label: 'Precio Total' },
                  { id: 'totalCost', label: 'Costo Total' },
                  { id: 'totalProfit', label: 'Beneficio' },
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
                    <ProductTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, products.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={products.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      {/* Drawer para añadir un nuevo producto */}
      <Drawer anchor="right" open={drawerOpen} onClose={handleCloseDrawer}>
        <Box p={3} width={300} role="presentation">
          <Typography variant="h6" gutterBottom>
            Nuevo Producto
          </Typography>
          <TextField
            label="Nombre"
            fullWidth
            margin="normal"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <TextField
            label="Cantidad"
            type="number"
            fullWidth
            margin="normal"
            value={newProduct.quantity}
            onChange={(e) => setNewProduct({ ...newProduct, quantity: Number(e.target.value) })}
          />
          <TextField
            label="Unidad de Medida"
            fullWidth
            margin="normal"
            value={newProduct.unitOfMeasure}
            onChange={(e) => setNewProduct({ ...newProduct, unitOfMeasure: e.target.value })}
          />
          <TextField
            label="Costo"
            type="number"
            fullWidth
            margin="normal"
            value={newProduct.cost}
            onChange={(e) => setNewProduct({ ...newProduct, cost: Number(e.target.value) })}
          />
          <TextField
            label="Precio"
            type="number"
            fullWidth
            margin="normal"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
          />
          <TextField
            label="Categoría"
            fullWidth
            margin="normal"
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
          />
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button variant="contained" onClick={handleCloseDrawer}>
              Guardar
            </Button>
          </Box>
        </Box>
      </Drawer>
    </DashboardContent>
  );
}
