import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import { BoardClienteView } from 'src/sections/board-cliente/view';

// ----------------------------------------------------------------------

export const RegisterPage =  lazy( () => import('src/pages/user-register'));
export const HomePage = lazy(() => import('src/pages/home'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const ClientePage = lazy(() => import('src/pages/client'));
export const BoardClientePage = lazy(() => import('src/pages/board-cliente'));
export const ProductPage = lazy(() => import('src/pages/product'));
export const CoursesPage = lazy(() => import('src/pages/courses'));
export const ChatbotPage = lazy(() => import('src/pages/chatbot'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const SalePage = lazy(() => import('src/pages/sale'))
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export function Router() {
  return useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense fallback={renderFallback}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { path: 'dashboard', element: <HomePage /> },
        { path: 'client', element: <ClientePage /> },
        { path: 'sale', element: <SalePage /> },
        { path: 'board-cliente', element: <BoardClientePage /> },
        { path: 'product', element: <ProductPage /> },
        { path: 'course', element: <CoursesPage /> },
        { path: 'chatbot', element: <ChatbotPage /> },
        { path: 'blog', element: <BlogPage /> },
      ],
    },
    {
      path: '/',
      element: (
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      ),
    },
    {
      path: '/register',
      element: (
        <AuthLayout>
          <RegisterPage />
        </AuthLayout>
      ),
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
