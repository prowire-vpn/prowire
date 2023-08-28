import {
  StateStore as IStateStore,
  StateStoreStoreCallback,
  StateStoreVerifyCallback,
  Metadata,
} from 'passport-oauth2';
import {Request} from 'express';

const states: Set<string> = new Set();

function store(req: Request, callback: StateStoreStoreCallback): void;
function store(req: Request, meta: Metadata, callback: StateStoreStoreCallback): void;
function store(
  req: Request,
  metaOrCallback: Metadata | StateStoreStoreCallback,
  callback?: StateStoreStoreCallback,
): void {
  if (typeof metaOrCallback === 'function') {
    callback = metaOrCallback;
  }
  if (!callback) throw new Error('callback is required');
  const state = req.query.state as string;
  if (!state) throw new Error('state is required');
  if (states.has(state)) return callback(new Error('state already exists'), state);
  states.add(state);
  callback(null, state);
}

function addState(state: string) {
  states.add(state);
}

function verify(req: Request, state: string, callback: StateStoreVerifyCallback): void;
function verify(
  req: Request,
  state: string,
  meta: Metadata,
  callback: StateStoreVerifyCallback,
): void;
function verify(
  req: Request,
  state: string,
  metaOrCallback: Metadata | StateStoreVerifyCallback,
  callback?: StateStoreVerifyCallback,
): void {
  if (typeof metaOrCallback === 'function') {
    callback = metaOrCallback;
  }
  if (!callback) throw new Error('callback is required');
  if (!states.has(state)) return callback(new Error('state does not exist'), false, state);
  states.delete(state);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  callback(null, true, state);
}

export const StateStore: IStateStore & {addState: (state: string) => void} = {
  store,
  verify,
  addState,
};
