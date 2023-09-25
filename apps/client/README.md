# Prowire client application

The prowire client application is a desktop and mobile application used to authenticate to Prowire and establish a VPN connection from the device.

It's built as a single shared codebase for all platforms, based on [React Native](https://reactnative.dev). The desktop versions, run using [Electron](https://www.electronjs.org), the shared React Native codebase is interpreted using [React Native for web](https://necolas.github.io/react-native-web).

## Developing

> [!IMPORTANT]
> All commands are to be executed from the monorepo root unless stated otherwise.

### Environment

#### React Native

Make sure to follow the React[ Native environment setup guide](https://reactnative.dev/docs/environment-setup) for the platform you're interested into.

To ensure everything is correctly setup, you can run the following command.

```bash
npx react-native doctor
```

#### Dependencies

Install all software dependencies using

```bash
npm ci -w client
```

### Running locally

```bash
# To run the Android/iOS version on an emulator or connected debugging device
npm run start:mobile -w client

# To run the desktop version on your current device
npm run start:desktop -w client
```

### Executing tests

Tests are executed using [Jest](https://jestjs.io/). They can be executed using the following command.

```bash
npm run test -w client
```
