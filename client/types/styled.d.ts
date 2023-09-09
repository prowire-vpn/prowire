import 'styled-components';
import {Theme} from 'ui/theme';
declare module 'styled-components' {
  export type DefaultTheme = Theme;
}

import 'styled-components/native';
declare module 'styled-components/native' {
  export type DefaultTheme = Theme;
}
