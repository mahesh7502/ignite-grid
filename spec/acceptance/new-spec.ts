import * as fs from "fs";
import cli = require("../../lib/cli");
import { deleteAll, resetSpy } from "../helpers/utils";

describe("New command", () => {
	beforeEach(() => {
		spyOn(console, "log");
		spyOn(console, "error");
		process.chdir("./output");
	});

	afterEach(() => {
		// clean test folder:
		deleteAll(this.testFolder);
		fs.rmdirSync(this.testFolder);
		process.chdir("../");
	});

	it("React project", async done => {
		// process.argv = ["new", "reactProj", "--framework=react"];

		await cli.run(["new", "reactProj", "--framework=react"]);

		//TODO: read entire structure from ./templates and verify everything is copied over
		expect(fs.existsSync("./reactProj")).toBeTruthy();
		this.testFolder = "./reactProj";
		done();
	});

	it("Should not work on existing folders", async done => {
		fs.mkdirSync("testProj");
		await cli.run(["new", "testProj"]);
		expect(console.error).toHaveBeenCalledWith(jasmine.stringMatching(/Folder "testProj" already exists!/));
		fs.rmdirSync("testProj");

		await cli.run(["new", "testProj2"]);
		expect(fs.existsSync("./testProj2")).toBeTruthy();
		expect(fs.existsSync("./testProj2/ignite-cli-views.js")).toBeTruthy();

		fs.writeFileSync("./testProj2/ignite-cli-views.js", "text");
		await cli.run(["new", "testProj2"]);
		expect(console.error).toHaveBeenCalledWith(jasmine.stringMatching(/Folder "testProj2" already exists!/));
		expect(fs.readFileSync("./testProj2/ignite-cli-views.js").toString())
			.toEqual("text", "Shouldn't overwrite existing project files!");

		resetSpy(console.error);
		await cli.run(["new", "   testProj2  \t  "]);
		expect(console.error).toHaveBeenCalledWith(jasmine.stringMatching(/Folder "testProj2" already exists!/));
		expect(fs.readFileSync("./testProj2/ignite-cli-views.js").toString())
			.toEqual("text", "Shouldn't overwrite existing project files!");

		this.testFolder = "./testProj2";
		done();
	});
});
