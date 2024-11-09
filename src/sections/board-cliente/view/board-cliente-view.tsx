import React, { useState, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Grid from '@mui/material/Unstable_Grid2';
import axios from 'axios';
import { DashboardContent } from 'src/layouts/dashboard';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';

export function BoardClienteView() {
  const [products, setProducts] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoriesCount, setCategoriesCount] = useState<Record<string, number>>({});
  const [sumByCategory, setSumByCategory] = useState<Record<string, number>>({});

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://backend-ayni.azurewebsites.net/api/products', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setProducts(response.data);

        // Calcular la cantidad de productos por categoría
        const counts = response.data.reduce((acc: Record<string, number>, product: any) => {
          acc[product.category] = (acc[product.category] || 0) + product.totalPrice;
          return acc;
        }, {});
        setCategoriesCount(counts);

        // Calcular la sumatoria de cantidad vendida por categoría
        const sums = response.data.reduce((acc: Record<string, number>, product: any) => {
          acc[product.category] = (acc[product.category] || 0) + product.quantity;
          return acc;
        }, {});
        setSumByCategory(sums);
      } else {
        setError('Error al obtener los productos.');
      }
    } catch (err: any) {
      console.error('Error al obtener los productos:', err);
      setError(err.response?.data?.message || 'Error desconocido al obtener los productos.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSales = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://backend-ayni.azurewebsites.net/api/sales', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setSales(response.data);
      } else {
        console.error('Error al obtener las ventas.');
      }
    } catch (err: any) {
      console.error('Error al obtener las ventas:', err);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchSales();
  }, [fetchProducts, fetchSales]);


  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Cargando productos...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!products.length) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Cargando productos disponibles.</Typography>
      </Box>
    );
  }

  if (!sales.length) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Cargando ventas disponibles.</Typography>
      </Box>
    );
  }

  // Preparar datos para las gráficas
  const countData = Object.entries(categoriesCount).map(([label, value]) => ({
    label,
    value,
  }));

  const volumeData = Object.entries(sumByCategory).map(([label, value]) => ({
    label,
    value,
  }));

  // Calcular el total de ventas de todos los productos
  const totalSales = products.reduce((acc, product) => acc + product.totalPrice, 0);
  const totalVolume = products.reduce((acc, product) => acc + product.quantity, 0);

// Calcular las ventas YTD (Year-To-Date) para cada año
const salesByYear = sales.reduce((acc: Record<number, number>, sale) => {
  const year = new Date(sale.date).getFullYear(); // Extraer el año de la venta
  acc[year] = (acc[year] || 0) + sale.totalAmount; // Sumar el totalAmount por año
  return acc;
}, {});

// Total de ventas para 2024 y 2023
const totalSales2024 = salesByYear[2024] || 0;
const totalSales2023 = salesByYear[2023] || 0;

// Variación porcentual entre las ventas de 2024 y 2023
const salesVariationYTD = totalSales2023
  ? ((totalSales2024 - totalSales2023) / totalSales2023) * 100
  : 0;


  // Calcular el margen de ganancia bruta
const grossProfitMargin = totalSales
? ((totalSales - sales.reduce((acc, sale) => acc + sale.product.totalCost, 0)) / totalSales) * 100
: 0;

// Calcular la ganancia total (en valor decimal)
const totalProfitValue = totalSales
  ? totalSales - sales.reduce((acc, sale) => acc + sale.product.totalCost, 0)
  : 0;

// Calcular el promedio de precio unitario
const averageUnitPrice = sales.length
  ? sales.reduce((acc, sale) => acc + sale.product.price, 0) / sales.length
  : 0;

  return (
    
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hola, Bienvenido de nuevo 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Venta total"
            percent={2.6}
            total={totalSales}
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-bag.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [22, 8, 35, 50, 82, 84, 77, 12],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Volumen Total"
            percent={-0.1}
            total={totalVolume}
            color="secondary"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 47, 40, 62, 73, 30, 23, 54],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Variación Porcentual de Ventas"
            percent={2.8}
            total={salesVariationYTD}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-buy.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [40, 70, 50, 28, 70, 75, 7, 64],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Margen de Ganancia Bruta"
            percent={grossProfitMargin}
            total={totalProfitValue}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-message.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 30, 23, 54, 47, 40, 62, 73],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Promedio Precio"
            percent={grossProfitMargin}
            total={averageUnitPrice}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-message.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 30, 23, 54, 47, 40, 62, 73],
            }}
          />
        </Grid>

        <Grid container spacing={5}>
  <Grid xs={12} md={6} lg={6}>
    <AnalyticsCurrentVisits
      title="Categoría por Productos"
      chart={{
        series: countData,
      }}
    />
  </Grid>

  <Grid xs={12} md={6} lg={6}>
    <AnalyticsCurrentVisits
      title="Volumen de Venta por Categoría"
      chart={{
        series: volumeData,
      }}
    />
  </Grid>
</Grid>



      

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsWebsiteVisits
            title="Website visits"
            subheader="(+43%) than last year"
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
              series: [
                { name: 'Team A', data: [43, 33, 22, 37, 67, 68, 37, 24, 55] },
                { name: 'Team B', data: [51, 70, 47, 67, 40, 37, 24, 70, 24] },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsConversionRates
            title="Conversion rates"
            subheader="(+43%) than last year"
            chart={{
              categories: ['Italy', 'Japan', 'China', 'Canada', 'France'],
              series: [
                { name: '2022', data: [44, 55, 41, 64, 22] },
                { name: '2023', data: [53, 32, 33, 52, 13] },
              ],
            }}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
