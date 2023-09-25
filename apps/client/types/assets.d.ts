declare module '*.svg' {
  import * as React from 'react';
  import {SvgProps} from 'react-native-svg';
  export const ReactComponent: React.FC<SvgProps>;
  export default ReactComponent;
}
