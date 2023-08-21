import {postRefreshTokenGenerator} from './postRefreshToken';
import {axios} from 'base/api';

export const postRefreshToken = async () => postRefreshTokenGenerator(axios);
