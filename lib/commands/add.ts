import { ProjectConfig } from "../ProjectConfig";
import { TemplateManager } from "../TemplateManager";
import { Util } from "../Util";
import { PackageManager } from "./../packages/PackageManager";
import { PromptSession } from "./../PromptSession";

let command: {
	[name: string]: any,
	templateManager: TemplateManager,
	execute: (argv: any) => Promise<void>,
	addTemplate: (name: string, template: Template) => Promise<boolean>
};
// tslint:disable:object-literal-sort-keys
command = {
	command: "add [template] [name]",
	desc: "Add component by it ID and providing a name.",
	templateManager: null,
	builder: {
		template: {
			alias: "t",
			description: `Template ID, such as "grid", "combo", etc.`,
			type: "string",
			global: true
		},
		name: {
			alias: "n",
			description: "File name.",
			type: "string",
			global: true
		}
	},
	check: argv => {
		if ((!argv.name && argv.template) || (argv.name  && !argv.template)) {
			return false;
		}
		return true;
	},
	async execute(argv) {
		if (!ProjectConfig.hasLocalConfig()) {
			Util.error("Add command is supported only on existing project created with igniteui-cli", "red");
			return;
		}
		const config =  ProjectConfig.getConfig();
		if (config.project.isShowcase) {
			Util.error("Showcases and quickstart projects don't support the add command", "red");
			return;
		}
		const framework = command.templateManager.getFrameworkById(config.project.framework);
		if (!framework) {
			Util.error("Framework not supported", "red");
			return;
		}
		const frameworkLibrary = command.templateManager.getProjectLibrary(
			config.project.framework,
			config.project.projectType
		) as ProjectLibrary;

		if (!argv.template && !argv.name) {
			const prompts = new PromptSession(command.templateManager);
			await prompts.chooseActionLoop(frameworkLibrary, config.project.theme);
			return;
		}

		if (!frameworkLibrary.hasTemplate(argv.template)) {
			Util.error("Template doesn't exist in the current library", "red");
			return;
		}

		const selectedTemplate = frameworkLibrary.getTemplateById(argv.template);
		if (selectedTemplate) {
			await command.addTemplate(argv.name, selectedTemplate);
			PackageManager.ensureIgniteUISource(config.packagesInstalled);
		}
	},
	async addTemplate(name: string, template: Template): Promise<boolean> {
		// trim name to avoid creating awkward paths or mismatches:
		name = name.trim();

		// letter+alphanumeric check
		if (!Util.isAlphanumericExt(name)) {
			Util.error(`Name '${name}' is not valid. `
				+ "Template names should start with a letter and can also contain numbers, dashes and spaces.",
				"red");
			return false;
		}

		if (await template.generateFiles(process.cwd(), name)) {
			//successful
			template.registerInProject(process.cwd(), name);
			command.templateManager.updateProjectConfiguration(template);
			Util.log(`${Util.greenCheck()} View '${name}' added.`);
			return true;
		} else {
			/* Log error? */
			return false;
		}
	}
};
// hint transpiler it's an ES6 module, exports without import won't do
export default command;
