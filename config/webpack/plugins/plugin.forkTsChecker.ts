import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import {Dir, WebpackConfigProps} from "../lib";

export function getForkTsCheckerPlugin({IS_PROD}: WebpackConfigProps) {
  return new ForkTsCheckerWebpackPlugin({typescript: {configFile: `${Dir.SRC}/tsconfig.json`}});
}
