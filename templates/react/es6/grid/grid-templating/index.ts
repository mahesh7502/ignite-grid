import * as path from "path";
//TODO:
import { GridHelper } from "../../../../../lib/project-utility/GridHelper";
import { ReactTemplate } from "../../../../../lib/templates/ReactTemplate";
import { Util } from "../../../../../lib/Util";

class GridTemplatingTemplate extends ReactTemplate {
	public extraConfigurations: ControlExtraConfiguration[] = [];
	public userExtraConfiguration: {} = {};
	private gridHelper: GridHelper;
	/**
	 *
	 */
	constructor() {
		super(__dirname);
		this.id = "grid-templating";
		this.name = "Grid Templating";
		this.description = "Grid with templating for React";
		this.projectType = "es6";
		this.components = ["Grid"];
		this.controlGroup = "Data Grids";
		this.dependencies = ["igGrid"];

		this.gridHelper = new GridHelper();
		this.hasExtraConfiguration = true;
		this.extraConfigurations.push({
			choices: ["Sorting", "Paging", "Filtering"],
			default: "",
			key: "features",
			message: "Select features for the igGrid",
			type: Enumerations.ControlExtraConfigType.MultiChoice
		});
	}

	public generateFiles(projectPath: string, name: string, ...options: any[]): Promise<boolean> {
		const config = {};
		const pathsConfig = {};
		const features = this.gridHelper.generateFeatures(this.userExtraConfiguration["features"], 5);

		config["__path__"] =  this.folderName(name); //folder name allowed spaces, any casing
		config["$(ClassName)"] = this.className(name); //first letter capital, no spaces,
		config["$(widget)"] = "igGrid";
		config["$(Control)"] = this.className("igGrid");
		config["$(igniteImports)"] = this.getImports();
		config["$(name)"] = name; // this name should not have restrictions
		config["$(gridfeatures)"] = features;
		config["$(description)"] = this.description;
		// TODO: Refactor to base
		if (!Util.validateTemplate(path.join(__dirname, "files"), projectPath, config, pathsConfig)) {
			return Promise.resolve(false);
		}
		return Util.processTemplates(path.join(__dirname, "files"), projectPath, config, pathsConfig);
	}
	public getExtraConfiguration(): ControlExtraConfiguration[] {
		return this.extraConfigurations;
	}
	public setExtraConfiguration(extraConfigKeys: {}) {
		this.userExtraConfiguration = extraConfigKeys;
	}
}
module.exports = new GridTemplatingTemplate();