import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ClienteView } from 'src/sections/cliente/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Clientes - ${CONFIG.appName}`}</title>
      </Helmet>

      <ClienteView />
    </>
  );
}
