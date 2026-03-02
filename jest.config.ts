module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',

  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'jest-css-modules-transform'
  },

  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest'
  },

  testMatch: ['**/?(*.)+(test).[tj]s?(x)']
};
