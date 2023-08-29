import {findServerGenerator} from './findServer';
import {client} from 'base/data';

export const findServer = async () => findServerGenerator(client);
