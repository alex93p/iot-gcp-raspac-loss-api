import { resolve } from "path";
import custom_env_var from "../../config/custom-environment-variables.json";
process.env["NODE_CONFIG_DIR"] = resolve(process.cwd(), "src/config");
import config from "config";
import { custom_environment_variables } from "../interfaces/custom_environment_variables";

function parse(custom_environment_variables: custom_environment_variables, parentKey?: string[]): custom_environment_variables {
    const json = {};
    Object.keys(custom_environment_variables).forEach(key => {
        parentKey = parentKey || [];
        if (typeof custom_environment_variables[key] === "object") json[key] = parse(custom_environment_variables[key], parentKey.concat(key));
        else json[key] = parentKey ? config.get(parentKey.concat(key).join(".")) : config.get(key);
    });
    return <custom_environment_variables>json;
}

// @ts-expect-error TS2345
export default parse(custom_env_var);
