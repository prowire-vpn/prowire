import {getHealthGenerator} from './getHealth';
import {axios} from 'base/api/client';

export const getHealth = async () => getHealthGenerator(axios);
export type {GetHealthResponseBody} from './getHealth';
