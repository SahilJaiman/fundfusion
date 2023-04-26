/** @type {import('next').NextConfig} */
const removeImports = require('next-remove-imports')();
const nextConfig = {
  experimental: {
    appDir: true,
  },
  externals: {
    'react-markdown': 'react-markdown',
  },
}

module.exports = (phase, { defaultConfig }) => {
  return removeImports({
    ...defaultConfig
  });
};
module.exports = nextConfig
