import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import { Dir, WebpackConfigProps } from '../lib'

export function getCleanPlugin (props: WebpackConfigProps) {
  return new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: [Dir.DIST] })
}
