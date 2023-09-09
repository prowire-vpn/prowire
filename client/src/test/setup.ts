jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-native-simple-openvpn', () => ({
  _esModule: true,
  default: {
    connect: jest.fn(),
    disconnect: jest.fn(),
  },
  addVpnStateListener: jest.fn(),
  removeVpnStateListener: jest.fn(),
}));
