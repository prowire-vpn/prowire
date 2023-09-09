import * as React from 'react';
import {createRoot} from 'react-dom/client';
import {App} from 'base/components/App';

const element = document.getElementById('app');
if (!element) throw new Error('No element with id "app" found');
const root = createRoot(element);
root.render(<App />);
