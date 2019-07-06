require('dotenv/config');
const withCSS = require('@zeit/next-css');
const R = require('ramda');

module.exports = withCSS({
  target: 'server',
  env: R.pipe(
    R.pick(['FIREBASE_CONFIG']),
    R.evolve({
      FIREBASE_CONFIG: (val) => JSON.parse(Buffer.from(val, 'base64').toString()),
    }),
  )(process.env),
});
