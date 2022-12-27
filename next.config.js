/* eslint-disable no-undef */
const path = require('path')
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  concurrentFeatures: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  experimental: {
    reactRoot: true,
    images: {
      layoutRaw: true,
    },
  },
  compiler: {
    removeConsole: {
      exclude: ['log'],
    },
    styledComponents: true,
  },
  webpack(config) {
    config.module.rules[3].oneOf.forEach((one) => {
      if (!`${one.issuer?.and}`.includes('_app')) return
      one.issuer.and = [path.resolve(__dirname)]
    })
    return config
  },
}

module.exports = nextConfig
