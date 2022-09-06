/* eslint-disable */
const path = require('path');
const webpackCommon = require('./webpack.common');

module.exports = {
    ...webpackCommon,
    mode: 'development',
    resolve: {
        ...webpackCommon.resolve,
        alias: {
            ...webpackCommon.resolve.alias,
            config$: path.resolve('./config/dev.config.json')
        }
    }
};