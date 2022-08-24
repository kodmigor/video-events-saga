import HtmlWebpackPlugin from 'html-webpack-plugin'
import { Dir, WebpackConfigProps } from '../lib'

export function getHtmlWebpackPlugin (props: WebpackConfigProps) {
  return new HtmlWebpackPlugin({
    minify: {
      collapseWhitespace: true
    },
    title: 'Video events',
    template: `${Dir.INDEX}/index.html`
  })
};
