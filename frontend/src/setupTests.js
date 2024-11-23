import '@testing-library/jest-dom';

// Mock fetch globally
global.fetch = jest.fn();

// Mock window.matchMedia
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});