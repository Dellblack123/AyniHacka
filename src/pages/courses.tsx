import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { CoursesView } from 'src/sections/courses';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Cursos - ${CONFIG.appName}`}</title>
      </Helmet>

      <CoursesView />
    </>
  );
}
