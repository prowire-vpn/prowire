import {write, close} from 'fs';
import {file, setGracefulCleanup} from 'tmp';
import {type TmpFileWriteOptions} from './tmp.types';

// Auto delete tmp files on shutdown
setGracefulCleanup();

/** Write some content to a temporary file, returns the path */
export async function writeToTmpFile(
  content: string,
  options?: TmpFileWriteOptions,
): Promise<string> {
  return new Promise((resolve, reject) => {
    file({prefix: 'prowire-', postfix: options?.postfix}, (error, path, fileDescriptor) => {
      if (error) {
        reject(error);
        return;
      }
      write(fileDescriptor, content, (error) => {
        if (error) {
          reject(error);
          return;
        }
        close(fileDescriptor, () => {
          resolve(path);
        });
      });
    });
  });
}
