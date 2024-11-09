import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ClientView } from 'src/sections/client/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Productos - ${CONFIG.appName}`}</title>
      </Helmet>

      <ClientView />
    </>
  );
}
