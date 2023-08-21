import {get} from 'http';

/** Get the public IP of the server by calling the ipfy API */
export async function getPublicIp(): Promise<string> {
  return new Promise((resolve, reject) => {
    get({host: 'api.ipify.org', port: 80, path: '/'}, function (resp) {
      resp.on('error', (error) => {
        reject(error);
      });
      resp.on('data', function (ip: string) {
        resolve(ip);
      });
    });
  });
}
