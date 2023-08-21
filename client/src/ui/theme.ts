import {TextStyle} from 'react-native';

const palette = {
  steelBlue: '#007DA7',
  darkGrey: '#042530',
  grey: '#8D979D',
  white: '#FFFFFF',
  lightBlue: '#B9D7E1',
  whiteBlue: '#E7F1F8',
  lightGrey: '#E5E6E7',
  red: '#E05A5A',
};

export const theme = {
  colors: {
    background: palette.darkGrey,
    primary: palette.steelBlue,
    grey: palette.grey,
    lightGrey: palette.lightGrey,
    danger: palette.red,
    white: palette.white,
  },
  textColors: {
    primary: palette.white,
    secondary: palette.grey,
    error: palette.red,
  },
  buttonColors: {
    primary: {
      base: palette.darkGrey,
      textContrast: palette.white,
      active: palette.steelBlue,
    },
    danger: {
      base: palette.red,
      textContrast: palette.white,
      active: palette.red,
    },
    white: {
      base: palette.white,
      textContrast: palette.darkGrey,
      active: palette.lightBlue,
    },
  },
  spacing: {
    xs: 8,
    s: 8,
    m: 16,
    l: 24,
    xl: 48,
  },
  textVariants: {
    header: {
      fontSize: 24,
      fontWeight: 'bold',
    } as TextStyle,
    body: {
      fontSize: 16,
    } as TextStyle,
  },
};

export type Theme = typeof theme;
