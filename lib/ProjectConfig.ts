import * as fs from "fs-extra";
import * as os from "os";
import * as path from "path";

export class ProjectConfig {

	public static configFile: string = "ignite-ui-cli.json";

	/** Returns true if there's a CLI config file in the current working directory */
	public static hasLocalConfig(): boolean {
		const filePath = path.join(process.cwd(), this.configFile);
		return fs.existsSync(filePath);
	}

	public static getConfig(global: boolean = false): Config {
		const filePath = path.join(process.cwd(), this.configFile);
		let config = this.globalDefaults();

		if (!global && fs.existsSync(filePath)) {
			try {
				const localConfig = JSON.parse(fs.readFileSync(filePath, "utf8")) as Config;
				config = Object.assign(config, localConfig);
			} catch (error) {
				throw new Error(`The ${this.configFile} file is not parsed correctly. ` +
					`The following error has occurred: ${error.message}`);
			}
		}
		return config;
	}
	public static setConfig(config: Config, global: boolean = false) {
		const basePath = global ? os.homedir() : process.cwd();
		const filePath = path.join(basePath, this.configFile);
		fs.writeJsonSync(filePath, config, { spaces: 4 });
	}

	public static globalConfig(): Config {
		const globalConfigPath = path.join(os.homedir(), this.configFile);
		let globalConfig = {};

		if (fs.existsSync(globalConfigPath)) {
			globalConfig = require(globalConfigPath);
		}
		return globalConfig as Config;
	}

	private static globalDefaults(): Config {
		let defaults: Config = require("./config/defaults.json");
		const globalConfig = this.globalConfig();

		// TODO: `Object.assign` doesn't do deep extend, nested object properties override!
		defaults = Object.assign(defaults, globalConfig);
		return defaults;
	}
}
