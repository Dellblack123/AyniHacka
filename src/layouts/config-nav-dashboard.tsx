import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`assets/icons/${name}.svg`} />
);

export const navData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Ventas',
    path: '/venta',
    icon: icon('ic-user'),
  },
  {
    title: 'Productsos',
    path: '/producto',
    icon: icon('assets/icons/products.svg'),
  },
  {
    title: 'Clientes',
    path: '/cliente',
    icon: icon('ic-user'),
  },
  {
    title: 'Usuarios',
    path: '/user',
    icon: icon('ic-user'),
  },
  {
    title: 'Sign in',
    path: '/sign-in',
    icon: icon('ic-lock'),
  }
];
