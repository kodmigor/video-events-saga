import {WebpackPluginInstance} from "webpack";
import {WebpackConfigProps} from "../lib";
import {getCleanPlugin} from "./plugin.clean";
import {getForkTsCheckerPlugin} from "./plugin.forkTsChecker";

import {getHtmlWebpackPlugin} from "./plugin.html";
import {getMiniCssExtractPlugin} from "./plugin.miniCssExtract";

export function getPlugins(props: WebpackConfigProps): WebpackPluginInstance[] {
    const plugins = [
        getCleanPlugin(props),
        getHtmlWebpackPlugin(props),
        getMiniCssExtractPlugin(props),
        getForkTsCheckerPlugin(props),
    ];

    return plugins;
}