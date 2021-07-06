const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
  bgColor: '#F9F9F9',
  primary: '#022c43',
  primaryRgb: '5,63,94',
  secondary: '#053f5e',
  secondaryRgb: '17,81,115',
  tertiary: '#115173',
  black: '#0E1111',
  white: '#FFFFFF',
  whiteRgb: '255,255,255',
  grey: '#D2D2D2',
  contentBg: '#F4F4F4',
  lightGrey: '#F9F9F9',
  mediumGrey: '#EEEEEE',
  red: '#DC3333',
  redRgb: '220, 51, 51',
  orange: '#FF8D06',
  orangeRgb: '255, 141, 6',
  yellow: '#ffd700',
  green: '#28DF99',
  veryLightGrey: '#e0e0e0',
  boxShadowLight: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,

    elevation: 1,
  },
  boxShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  }
};
