import { RuleSetRule } from 'webpack'

import { Dir, WebpackConfigProps } from '../lib'

export function getScriptsRule (props: WebpackConfigProps): RuleSetRule {
  return {
    exclude: '/node_modules/',
    test: /\.tsx?$/,
    use: [
      {
        loader: 'ts-loader',
        options: {
          transpileOnly: true
        }
      }
    ]
  }
}
