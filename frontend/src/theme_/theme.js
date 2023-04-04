import { defineStyleConfig, extendTheme } from '@chakra-ui/react';
import { MultiSelectTheme } from 'chakra-multiselect';
import { extendTheme } from '@chakra-ui/react';
const theme = extendTheme({ config })
const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

export const themeObj = {
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
  colors: {
    blue: {
      200: '#2b81ef',
      300: '#37A5DE',
      400: '#236AF9',
    },
    pink: {
      400: '#b75cdd',
    },
    purple: {
      500: '#814be1',
    },
    green: {
      400: '#47b97a',
    },
    red: {
      400: '#f05959',
    },
    brand: {
      800: '#030320',
      700: '#040412',
      600: '#262240',
      500: '#e3e5f3',
    },
  },
  styles: {
    global: {
      body: {
        bg: 'brand.700',
        fg: 'brand.500',
      },
    },
  },
  components: {
    Tooltip: defineStyleConfig({
      baseStyle: {
        borderRadius: 'md',
      },
    }),
    ModalContent: defineStyleConfig({
      defaultProps: {
        bg: 'brand.700',
        borderColor: 'chakra-border-color',
        borderWidth: '2px',
        borderRadius: 'xl',
      },
    }),
    ModalOverlay: defineStyleConfig({
      baseStyle: {
        backdropFilter: 'auto',
        backdropBlur: '2px',
      },
    }),
    MultiSelect: MultiSelectTheme,
  },
};

// const theme = extendTheme(themeObj, { config });

export default theme;
