import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ProductView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Productos - ${CONFIG.appName}`}</title>
      </Helmet>

      <ProductView />
    </>
  );
}
