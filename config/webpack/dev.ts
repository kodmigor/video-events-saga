import { merge } from 'webpack-merge'

import { getWebpackBaseConfig } from './base'
import { Dir, WebpackConfig } from './lib'

export default function getWebpackDevConfig () {
  return merge<WebpackConfig>(getWebpackBaseConfig('development'), {
    devServer: {
      historyApiFallback: true,
      hot: true,
      port: 3000,
      static: Dir.DIST
    },
    devtool: 'eval-cheap-module-source-map',
    output: {
      filename: '[name].js'
    }
  })
}
