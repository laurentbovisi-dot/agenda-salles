// Thème PrimeVue : thème Aura, avec le bleu marine du logo comme couleur principale.
import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

export const ThemeJardins = definePreset(Aura, {
  semantic: {
    // Nuances du bleu marine du logo (#173855 = nuance 700)
    primary: {
      50: '#eef3f8',
      100: '#d5e0ec',
      200: '#aac1d8',
      300: '#7c9dbf',
      400: '#4f78a3',
      500: '#2c5682',
      600: '#1f4669',
      700: '#173855',
      800: '#112b42',
      900: '#0c1f30',
      950: '#07131e'
    },
    colorScheme: {
      light: {
        primary: {
          color: '{primary.700}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.800}',
          activeColor: '{primary.900}'
        }
      }
    }
  }
})
