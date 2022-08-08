import {merge} from "webpack-merge";

import {getWebpackBaseConfig} from "./base";
import {WebpackConfig} from "./lib";


export default function getWebpackProdConfig() {
	return merge<WebpackConfig>(getWebpackBaseConfig("production"), {
		output: {
			filename: `[name].[contenthash:7].js`,
		},
	});
}