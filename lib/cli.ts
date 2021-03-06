import chalk from "chalk";
import * as inquirer from "inquirer";
import * as yargs from "yargs";
import { default as add } from "./commands/add";
import { default as build } from "./commands/build";
import { default as config } from "./commands/config";
import { default as doc } from "./commands/doc";
import { default as generate } from "./commands/generate";
import { default as list } from "./commands/list";
import { default as newCommand } from "./commands/new";
import { default as quickstart } from "./commands/quickstart";
import { default as start } from "./commands/start";
import { default as test } from "./commands/test";
import { GoogleAnalytics } from "./GoogleAnalytics";
import { PromptSession } from "./PromptSession";
import {TemplateManager} from "./TemplateManager";
import { Util } from "./Util";

process.title = "Ignite UI CLI";

function logHelp() {
	GoogleAnalytics.post({
		t: "screenview",
		cd: "$ig help"
	});
}

export async function run(args = null) {
	//	we are subscribing on process.exit to catch when help is executed
	process.on("exit", logHelp);

	const templateManager = new TemplateManager();

	newCommand.template = templateManager;
	newCommand.builder.framework.choices = templateManager.getFrameworkIds();
	add.templateManager = templateManager;
	build.templateManager = templateManager;
	start.templateManager = templateManager;
	generate.templateManager = templateManager;
	list.templateManager = templateManager;

	const yargsModule = args ? yargs(args) : yargs;

	const argv = yargsModule
	.command(quickstart)
	.command(newCommand)
	.command(add)
	.command(build)
	.command(start)
	.command(generate)
	.command(config)
	.command(doc)
	.command(test)
	.command(list)
	.options({
		version: {
			alias: "v",
			description: "Show current Ignite UI CLI version",
			global: true,
			type: "boolean"
		}
	})
	.help().alias("help", "h")
	.argv;

	//	unsubscribing from process.exit. If `help` was executed we should not reach here
	process.removeListener("exit", logHelp);

	if (argv.version) {
		Util.showVersion();
		return;
	}

	const command = argv._[0];
	switch (command) {
		case "new":
			await newCommand.execute(argv);
			break;
		case "quickstart":
			await quickstart.execute(argv);
			Util.log("quickstart Created");
			break;
		case "add":
			if (add.check(argv)) {
				await add.execute(argv);
			} else {
				yargsModule.showHelp();
				return;
			}
			break;
		case "g":
		case "generate":
			await generate.template(argv);
			break;
		case "build":
			await build.execute(argv);
			break;
		case "config":
			break;
		case "doc":
			await doc.execute(argv);
			break;
		case "test":
			await test.execute(argv);
			break;
		case "start":
			await start.execute(argv);
			break;
		case "l":
		case "list":
			list.execute(argv);
			break;
		default:
			Util.log("Starting Step by step mode.", "green");
			Util.log("For available commands, stop this execution and use --help.", "green");
			const prompts = new PromptSession(templateManager);
			prompts.start();
			break;
	}
}
