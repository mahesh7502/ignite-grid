
import { default as testCmd } from "../../lib/commands/test";
import { GoogleAnalytic } from "../../lib/GoogleAnalytic";
import { ProjectConfig } from "../../lib/ProjectConfig";
import { Util } from "../../lib/Util";

describe("Unit - Test command", () => {
	beforeAll(() => {
		spyOn(GoogleAnalytic, "post");
	});

	beforeEach(() => {
		spyOn(Util, "exec");
	});

	it("Run tests for the current project", async done => {
		await testCmd.test({});
		expect (Util.exec).toHaveBeenCalledWith("npm test", { stdio: "inherit" });

		done();
	});

	it("Run e2e tests for igx-ts Angular project type", async done => {
		spyOn(ProjectConfig, "getConfig").and.returnValue({ project: {
			framework: "angular",
			projectType: "igx-ts"}});

		await testCmd.test({e2e: true});
		expect (Util.exec).toHaveBeenCalledWith("npm run e2e", { stdio: "inherit" });

		done();
	});

	it("e2e command for ig-ts Angular project type runs test command instead", async done => {
		spyOn(ProjectConfig, "getConfig").and.returnValue({ project: {
			framework: "angular",
			projectType: "ig-ts"}});

		await testCmd.test({e2e: true});
		expect (Util.exec).toHaveBeenCalledWith("npm test", { stdio: "inherit" });

		done();
	});

	it("e2e command for jQuery project runs test command instead", async done => {
		spyOn(ProjectConfig, "getConfig").and.returnValue({ project: {
			framework: "jquery"}});

		await testCmd.test({e2e: true});
		expect (Util.exec).toHaveBeenCalledWith("npm test", { stdio: "inherit" });

		done();
	});

	it("e2e command for React project runs test command instead", async done => {
		spyOn(ProjectConfig, "getConfig").and.returnValue({ project: {
			framework: "react"}});

		await testCmd.test({e2e: true});
		expect (Util.exec).toHaveBeenCalledWith("npm test", { stdio: "inherit" });

		done();
	});
});
