import * as path from "path";
import * as resolve from "resolve";
import { GoogleAnalytics } from "../GoogleAnalytics";
import { Util } from "../Util";

// TODO: remove. exec blocks main stdio!
import shell = require("shelljs");

// tslint:disable:object-literal-sort-keys
const command = {
	command: "quickstart",
	desc: "creates rich feature grid",
	builder: {
		framework: {
			alias: "f",
			default: "jquery",
			describe: "Framework to setup quickstart for",
			type: "string",
			choices: ["jquery", "react", "angular"]
		}
	},
	async execute(argv) {
		GoogleAnalytics.post({
			t: "screenview",
			cd: "Quick Start"
		});

		Util.log("Quick Start!");
		const framework = argv.framework;
		let name = "";
		let type = "";
		switch (framework) {
			case "jquery":
				name = "jquery-quickstart";
				type = "js";
				break;
			case "react":
				name = "react-quickstart";
				type = "es6";
				break;
			case "angular":
				name = "angular-quickstart";
				type = "ig-ts";
				break;
			default:
				Util.error("The framework is not supported!", "red");
				return;
		}

		const outDir = path.join(process.cwd(), name);

		if (Util.directoryExists(path.join(__dirname, "../../templates/quickstart", argv.framework))) {
			await Util.processTemplates(path.join(__dirname, "../../templates/quickstart", argv.framework), outDir, {}, {});
		}
		//change folder
		process.chdir(name);

		GoogleAnalytics.post({
			t: "event",
			ec: "$ig quickstart",
			ea: `framework: ${argv.framework}`,
			cd1: framework,
			cd2: type,
			cd3: name
		});

		if (argv.framework === "react") {
			Util.log("react-quickstart loaded");
			shell.exec("npm install");
			shell.exec("npm run webpack");
			// lite-server installed per project
			const liteServer = require(resolve.sync("lite-server", { basedir: process.cwd() }));
			liteServer.server();
		}

		if (argv.framework === "angular") {
			Util.log("angular-quickstart loaded");
			shell.exec("npm install");
			shell.exec("npm start");
		}

		if (argv.framework === "jquery") {
			Util.log("jquery-quickstart loaded");
			shell.exec("npm install");
			// lite-server installed per project
			const liteServer = require(resolve.sync("lite-server", { basedir: process.cwd() }));
			liteServer.server();
		}
	}
};
export default command;
