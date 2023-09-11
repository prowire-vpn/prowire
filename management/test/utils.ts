/* eslint-disable import/export */
import {render, RenderOptions} from '@testing-library/react';
import {ReactElement} from 'react';
import {Provider} from 'base/components';

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, {wrapper: Provider, ...options});

export * from '@testing-library/react';
export {customRender as render};
