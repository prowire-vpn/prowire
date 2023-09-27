import {setLogger} from 'log';

beforeEach(async () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setLogger(() => {});
});
