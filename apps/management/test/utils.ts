/* eslint-disable import/export */
import {render, type RenderOptions} from '@testing-library/react';
import {type ReactElement} from 'react';
import {Provider} from 'base/components';

function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
): ReturnType<typeof render> {
  return render(ui, {wrapper: Provider, ...options});
}

export * from '@testing-library/react';
export {customRender as render};
