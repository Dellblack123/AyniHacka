import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { SaleView } from 'src/sections/sale/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Ventas - ${CONFIG.appName}`}</title>
      </Helmet>

      <SaleView />
    </>
  );
}
