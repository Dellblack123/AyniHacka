import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { RegisterView } from 'src/sections/user-register';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Registro - ${CONFIG.appName}`}</title>
      </Helmet>

      <RegisterView />
    </>
  );
}
