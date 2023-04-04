import { ColorModeScript } from '@chakra-ui/react';
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
// import '@fontsource/inter/100.css';
// import '@fontsource/inter/200.css';
// import '@fontsource/inter/300.css';
// import '@fontsource/inter/400.css';
// import '@fontsource/inter/500.css';
// import '@fontsource/inter/600.css';
// import '@fontsource/inter/700.css';
// import '@fontsource/inter/800.css';

import '@fontsource/plus-jakarta-sans/200.css';
import '@fontsource/plus-jakarta-sans/300.css';
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';
import '@fontsource/plus-jakarta-sans/800.css';
import { ChakraProvider } from '@chakra-ui/react';
// import theme from './theme_/theme';
import theme from "./theme/themeAdmin.js";
import RoutesConfig from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const container = document.getElementById('root');
const root = createRoot(container);

const client = new QueryClient();

root.render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <ReactQueryDevtools />
      {/* <ColorModeScript /> */}
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <RoutesConfig />
      </ChakraProvider>
    </QueryClientProvider>
  </StrictMode>
);
