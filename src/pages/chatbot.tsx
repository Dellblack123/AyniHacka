import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ChatbotView } from 'src/sections/chatbot';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Chatbot - ${CONFIG.appName}`}</title>
      </Helmet>

      <ChatbotView />
    </>
  );
}
