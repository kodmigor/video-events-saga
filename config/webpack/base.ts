import { Dir, WebpackConfig, WebpackConfigProps, WebpackMode } from './lib'
import { getPlugins } from './plugins'
import { getRules } from './rules'

export function getWebpackBaseConfig (mode: WebpackMode): WebpackConfig {
  const IS_PROD = mode === 'production'
  const props: WebpackConfigProps = { IS_PROD }
  const target = IS_PROD ? 'browserslist' : 'web'

  return {
    mode,
    target,
    devtool: false,
    entry: `${Dir.INDEX}/index.tsx`,
    module: {
      rules: getRules(props)
    },
    output: {
      clean: true,
      path: Dir.DIST,
      publicPath: '/'
    },
    plugins: getPlugins(props),
    resolve: {
      modules: ['node_modules', Dir.SRC],
      extensions: ['.tsx', '.ts', '.js', '.css', '.scss', 'json']
    },
    optimization: {
      runtimeChunk: 'single'
    },
    stats: 'errors-only'
  }
}
