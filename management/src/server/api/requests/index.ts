import {findServerGenerator} from './findServer';
import {axios} from 'base/api';

export const findServer = async () => findServerGenerator(axios);
