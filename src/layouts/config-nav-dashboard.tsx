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
    title: 'Board Cliente',
    path: '/board-cliente',
    icon: icon('/board-cliente'),
  },
  {
    title: 'Productos',
    path: '/product',
    icon: icon('/products'),
  },
  {
    title: 'Ventas',
    path: '/sale',
    icon: icon('/sale'),
  },
  {
    title: 'Cursos',
    path: '/course',
    icon: icon('/course'),
  },
  {
    title: 'Chatbot',
    path: '/chatbot',
    icon: icon('/bot'),
  },
];
