import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Clientes',
    path: '/client',
    icon: icon('/customers'),
  },
  {
    title: 'Productos',
    path: '/product',
    icon: icon('/customers'),
  },
  {
    title: 'Cursos',
    path: '/course',
    icon: icon('/customers'),
  },
  {
    title: 'Sign in',
    path: '/sign-in',
    icon: icon('ic-lock'),
  }
];
