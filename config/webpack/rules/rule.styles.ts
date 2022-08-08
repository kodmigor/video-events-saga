import MiniCssExtractPlugin from "mini-css-extract-plugin";
import {Dir, WebpackConfigProps} from "../lib";

export function getStylesRule({IS_PROD}: WebpackConfigProps) {
    return {
        include: Dir.SRC,
        test: /\.s?css$/,
        use: [
            {
                loader: IS_PROD ? MiniCssExtractPlugin.loader : "style-loader",
            },
            {
                loader: "css-loader",
            },
            {
                loader: "postcss-loader",
                options: {
                    postcssOptions: {
                        plugins: [require('postcss-preset-env')],
                    },
                },
            },
            {
                loader: "sass-loader",
            },
        ],
    };
}
