import {WebpackConfigProps} from "../lib";

import {getScriptsRule} from "./rule.scripts";
import {getStylesRule} from "./rule.styles";


export function getRules(props: WebpackConfigProps) {
	return [
		getScriptsRule(props),
		getStylesRule(props),
		// getSVGRule(props),
	];
}