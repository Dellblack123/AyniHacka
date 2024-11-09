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
import { ClientTableRow } from '../sale-table-row';
import { ProductTableHead } from '../sale-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { ClientTableToolbar } from '../sale-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { SaleProps } from '../sale-table-row';
import { useTable } from '../use-table';

export function SaleView() {
  const table = useTable();
  const [clients, setClients] = useState<SaleProps[]>([]);
  const [filterName, setFilterName] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [newClient, setNewClient] = useState({
    id: '',
    customerSegment: '',
    name: '',
    clientType: '',
    region: '',
    city: '',
    zone: '',
    contact: '',
  });

  const handleOpenDrawer = () => setDrawerOpen(true);
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setIsEditing(false);
    setSelectedClientId(null);
    setNewClient({
      id: '',
      customerSegment: '',
      name: '',
      clientType: '',
      region: '',
      city: '',
      zone: '',
      contact: '',
    });
  };

  const handleSaveClient = async () => {
    if (isEditing) {
      await handleUpdateClient();
    } else {
      await handleCreateClient();
    }
  };

  const handleCreateClient = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.post(
          'https://backend-ayni.azurewebsites.net/api/clients',
          {
            id: newClient.id,
            name: newClient.name,
            customerSegment: newClient.customerSegment,
            clientType: newClient.clientType,
            region: newClient.region,
            city: newClient.city,
            zone: newClient.zone,
            contact: newClient.contact,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        setClients([...clients, response.data]);
        handleCloseDrawer();
      } catch (error) {
        console.error('Error creating client:', error);
      }
    }
  };

  const handleUpdateClient = async () => {
    const token = localStorage.getItem('token');
    if (token && selectedClientId) {
      try {
        const response = await axios.put(
          `https://backend-ayni.azurewebsites.net/api/clients/${selectedClientId}`,
          {
            id: newClient.id,
            customerSegment: newClient.customerSegment,
            name: newClient.name,
            clientType: newClient.clientType,
            region: newClient.region,
            city: newClient.city,
            zone: newClient.zone,
            contact: newClient.contact,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        setClients(clients.map((client) =>
          client.id === selectedClientId ? response.data : client
        ));
        handleCloseDrawer();
      } catch (error) {
        console.error('Error updating client:', error);
      }
    }
  };

  const handleEdit = (client: SaleProps) => {
    setSelectedClientId(client.id);
    setIsEditing(true);
    setNewClient({
      id: client.id,
      customerSegment: client.customerSegment,
      name: client.name,
      clientType: client.clientType,
      region: client.region,
      city: client.city,
      zone: client.zone,
      contact: client.contact,
    });
    handleOpenDrawer();
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await axios.delete(`https://backend-ayni.azurewebsites.net/api/clients/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClients(clients.filter((client) => client.id !== id));
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    }
  };

  useEffect(() => {
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
    fetchClients();
  }, []);

  const dataFiltered = applyFilter({
    inputData: clients,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Clientes
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
          Nuevo Cliente
        </Button>
      </Box>

      <Card>
        <ClientTableToolbar
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
                rowCount={clients.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    clients.map((client) => client.id)
                  )
                }
                headLabel={[
                  { id: 'name', label: 'Nombre' },
                  { id: 'clientType', label: 'Tipo de Cliente' },
                  { id: 'city', label: 'Ciudad' },
                  { id: 'region', label: 'Región' },
                  { id: 'zone', label: 'Zona' },
                  { id: 'contact', label: 'Contacto' },
                  { id: 'customerSegment', label: 'Segmento de Cliente' },
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
                    <ClientTableRow
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
                  emptyRows={emptyRows(table.page, table.rowsPerPage, clients.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={clients.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      <Drawer anchor="right" open={drawerOpen} onClose={handleCloseDrawer}>
        <Box p={3} width={300} role="presentation">
          <Typography variant="h6" gutterBottom>
            {isEditing ? 'Actualizar Cliente' : 'Nuevo Cliente'}
          </Typography>
          <TextField
            label="DNI / RUC"
            fullWidth
            margin="normal"
            value={newClient.id}
            onChange={(e) => setNewClient({ ...newClient, id: e.target.value })}
          />
          <TextField
            label="Segmento de Cliente"
            fullWidth
            margin="normal"
            value={newClient.customerSegment}
            onChange={(e) => setNewClient({ ...newClient, customerSegment: e.target.value })}
          />
          <TextField
            label="Nombre"
            fullWidth
            margin="normal"
            value={newClient.name}
            onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
          />
          <TextField
            label="Tipo de Cliente"
            fullWidth
            margin="normal"
            value={newClient.clientType}
            onChange={(e) => setNewClient({ ...newClient, clientType: e.target.value })}
          />
          <TextField
            label="Región"
            fullWidth
            margin="normal"
            value={newClient.region}
            onChange={(e) => setNewClient({ ...newClient, region: e.target.value })}
          />
          <TextField
            label="Ciudad"
            fullWidth
            margin="normal"
            value={newClient.city}
            onChange={(e) => setNewClient({ ...newClient, city: e.target.value })}
          />
          <TextField
            label="Zona"
            fullWidth
            margin="normal"
            value={newClient.zone}
            onChange={(e) => setNewClient({ ...newClient, zone: e.target.value })}
          />
          <TextField
            label="Contacto"
            fullWidth
            margin="normal"
            value={newClient.contact}
            onChange={(e) => setNewClient({ ...newClient, contact: e.target.value })}
          />
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button variant="contained" onClick={handleSaveClient}>
              {isEditing ? 'Actualizar' : 'Guardar'}
            </Button>
          </Box>
        </Box>
      </Drawer>
    </DashboardContent>
  );
}
