import {Configuration} from "webpack";
import {Configuration as WebpackDevServerConfiguration} from "webpack-dev-server";

export interface WebpackConfig extends Configuration {
    devServer?: WebpackDevServerConfiguration
}


export type WebpackMode = Configuration["mode"];

export interface WebpackConfigProps {
    IS_PROD: boolean
}