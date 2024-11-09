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
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    quantity: '' as number | string,
    unitOfMeasure: '',
    cost: '' as number | string,
    price: '' as number | string,
    category: '',
  });

  const handleOpenDrawer = () => setDrawerOpen(true);
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setIsEditing(false);
    setSelectedProductId(null);
    setNewProduct({
      name: '',
      quantity: '',
      unitOfMeasure: '',
      cost: '',
      price: '',
      category: '',
    });
  };

  const handleSaveProduct = async () => {
    if (isEditing) {
      await handleUpdateProduct();
    } else {
      await handleCreateProduct();
    }
  };

  const handleCreateProduct = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.post(
          'https://backend-ayni.azurewebsites.net/api/products/create',
          {
            name: newProduct.name,
            quantity: newProduct.quantity,
            unitOfMeasure: newProduct.unitOfMeasure,
            cost: newProduct.cost,
            price: newProduct.price,
            category: newProduct.category,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        
        // Añadir el nuevo producto a la lista y cerrar el drawer
        setProducts([...products, response.data]);
        handleCloseDrawer();
      } catch (error) {
        console.error('Error creating product:', error);
      }
    }
  };

  const handleUpdateProduct = async () => {
    const token = localStorage.getItem('token');
    if (token && selectedProductId) {
      try {
        const response = await axios.put(
          `https://backend-ayni.azurewebsites.net/api/products/update/${selectedProductId}`,
          {
            name: newProduct.name,
            quantity: newProduct.quantity,
            unitOfMeasure: newProduct.unitOfMeasure,
            cost: newProduct.cost,
            price: newProduct.price,
            category: newProduct.category,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        setProducts(products.map((product) =>
          product.id === selectedProductId ? response.data : product
        ));
        handleCloseDrawer();
      } catch (error) {
        console.error('Error updating product:', error);
      }
    }
  };

  const handleEdit = (product: ProductProps) => {
    setSelectedProductId(product.id);
    setIsEditing(true);
    setNewProduct({
      name: product.name,
      quantity: product.quantity,
      unitOfMeasure: product.unitOfMeasure,
      cost: product.cost,
      price: product.price,
      category: product.category,
    });
    handleOpenDrawer();
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await axios.delete(`https://backend-ayni.azurewebsites.net/api/products/delete/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(products.filter((product) => product.id !== id));

        if (token) {
          try {
            const response = await axios.get('https://backend-ayni.azurewebsites.net/api/products', {
              headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(response.data);
          } catch (error) {
            console.error('Error fetching products:', error);
          }
        }

      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('https://backend-ayni.azurewebsites.net/api/products', {
            headers: { Authorization: `Bearer ${token}` }
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
          onClick={() => {
            setIsEditing(false);
            handleOpenDrawer();
          }}
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
            <Table sx={{ minWidth: 1200 }}>
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
                      onEdit={() => handleEdit(row)}
                      onDelete={() => handleDelete(row.id)}
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
          {isEditing ? 'Actualizar Producto' : 'Nuevo Producto'}
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
            <Button variant="contained" onClick={handleSaveProduct}>
            {isEditing ? 'Actualizar' : 'Guardar'}
            </Button>
          </Box>
        </Box>
      </Drawer>
    </DashboardContent>
  );
}
