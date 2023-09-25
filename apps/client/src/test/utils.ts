import {render, RenderOptions} from '@testing-library/react-native';
import {ReactElement} from 'react';
import {Providers} from 'base/components';

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, {wrapper: Providers, ...options});

// re-export everything

export * from '@testing-library/react-native';
export {customRender as render};
