import MiniCssExtractPlugin from "mini-css-extract-plugin";
import {WebpackConfigProps} from "../lib";

export function getMiniCssExtractPlugin({IS_PROD}: WebpackConfigProps) {
  return new MiniCssExtractPlugin({filename: `[name]${IS_PROD ? ".[contenthash]" : ""}.css`});
}
