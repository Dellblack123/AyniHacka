import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ClientView } from 'src/sections/client/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Clientes - ${CONFIG.appName}`}</title>
      </Helmet>

      <ClientView />
    </>
  );
}
