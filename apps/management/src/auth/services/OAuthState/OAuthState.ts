import {bytesToBase64} from 'byte-base64';

const StateKey = 'auth:state';

class OAuthState {
  private static instance: OAuthState;

  private constructor() {
    OAuthState.instance = this;
  }

  public static getService(): OAuthState {
    if (OAuthState.instance) return OAuthState.instance;
    return new OAuthState();
  }

  /** Generate an OAuth state parameter */
  public create(): string {
    // Generate crypto state
    const rawState = new Uint8Array(16);
    crypto.getRandomValues(rawState);
    const state = bytesToBase64(rawState);
    window.localStorage.setItem(StateKey, state);
    return state;
  }

  /** Check that the given state is the latest generated one */
  public check(testState: string | null | undefined): boolean {
    const state = this.get();
    return !!testState && !!state && (testState === state || `management:${state}` === testState);
  }

  /** Clear OAuth state */
  public clear() {
    window.localStorage.removeItem(StateKey);
  }

  /** Get current state value */
  public get(): string | null {
    return window.localStorage.getItem(StateKey);
  }
}

export const OAuthStateService = OAuthState.getService();
