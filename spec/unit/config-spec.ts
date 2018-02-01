import { default as configCmd } from "../../lib/commands/config";
import { ProjectConfig } from "../../lib/ProjectConfig";
import { Util } from "../../lib/Util";

describe("Unit - Config command", () => {

	describe("Get", () => {
		it("Should show error w/o existing project and global flag", async done => {
			spyOn(Util, "error");
			spyOn(ProjectConfig, "hasLocalConfig").and.returnValue(false);

			await configCmd.getHandler({ property: "test" });
			expect(Util.error).toHaveBeenCalledWith("No configuration file found in this folder!", "red");
			done();
		});

		it("Should show error for missing prop", async done => {
			spyOn(Util, "error");
			spyOn(ProjectConfig, "hasLocalConfig").and.returnValue(true);
			spyOn(ProjectConfig, "getConfig").and.returnValue({ notTest: "ig" });

			await configCmd.getHandler({ property: "test" });
			expect(ProjectConfig.getConfig).toHaveBeenCalledWith(undefined);
			expect(Util.error).toHaveBeenCalledWith(`No value found for "test" property`, "red");
			done();
		});

		it("Should show error for missing prop and global flag", async done => {
			spyOn(Util, "error");
			spyOn(ProjectConfig, "hasLocalConfig").and.returnValue(true);
			spyOn(ProjectConfig, "getConfig").and.returnValue({ notTest: "ig" });

			await configCmd.getHandler({ property: "test", global: true });
			expect(ProjectConfig.getConfig).toHaveBeenCalledWith(true);
			expect(Util.error).toHaveBeenCalledWith(`No value found for "test" property`, "red");
			done();
		});

		it("Should return value for property", async done => {
			spyOn(Util, "log");
			spyOn(ProjectConfig, "hasLocalConfig").and.returnValue(true);
			spyOn(ProjectConfig, "getConfig").and.returnValue({ test: "igValue" });

			await configCmd.getHandler({ property: "test" });
			expect(ProjectConfig.getConfig).toHaveBeenCalledWith(undefined);
			expect(Util.log).toHaveBeenCalledWith("igValue");
			done();
		});
	});

	describe("Set", () => {
		it("Should show error w/o existing project and global flag", async done => {
			spyOn(Util, "error");
			spyOn(ProjectConfig, "hasLocalConfig").and.returnValue(false);

			await configCmd.setHandler({ property: "test", value: true });
			expect(Util.error).toHaveBeenCalledWith("No configuration file found in this folder!", "red");
			done();
		});

		it("Should set global prop", async done => {
			spyOn(Util, "log");
			spyOn(ProjectConfig, "hasLocalConfig");
			spyOn(ProjectConfig, "globalConfig").and.returnValue({ test: "ig" });
			spyOn(ProjectConfig, "localConfig");
			spyOn(ProjectConfig, "setConfig");

			await configCmd.setHandler({ property: "test", value: true, global: true });

			expect(ProjectConfig.hasLocalConfig).toHaveBeenCalledTimes(0);
			expect(ProjectConfig.localConfig).toHaveBeenCalledTimes(0);
			expect(ProjectConfig.globalConfig).toHaveBeenCalled();
			expect(ProjectConfig.setConfig).toHaveBeenCalledWith({ test: true }, true /*global*/);
			expect(Util.log).toHaveBeenCalledWith(`Property "test" set`);
			done();
		});

		it("Should set local prop", async done => {
			spyOn(Util, "log");
			spyOn(ProjectConfig, "hasLocalConfig").and.returnValue(true);
			spyOn(ProjectConfig, "localConfig").and.returnValue({ notTest: "ig" });
			spyOn(ProjectConfig, "globalConfig");
			spyOn(ProjectConfig, "setConfig");

			await configCmd.setHandler({ property: "test", value: true });
			expect(ProjectConfig.globalConfig).toHaveBeenCalledTimes(0);
			expect(ProjectConfig.localConfig).toHaveBeenCalled();
			expect(ProjectConfig.setConfig).toHaveBeenCalledWith({ notTest: "ig", test: true }, undefined);
			expect(Util.log).toHaveBeenCalledWith(`Property "test" set`);
			done();
		});
	});
});
