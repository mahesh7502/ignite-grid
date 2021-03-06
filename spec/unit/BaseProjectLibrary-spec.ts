import * as path from "path";
import { BaseProjectLibrary } from "../../lib/BaseProjectLibrary";
import { TemplateManager } from "../../lib/TemplateManager";
import { Util } from "../../lib/Util";
describe("Unit - Base project library ", () => {

	it("has correct projects.", async done => {
		const mockProjects = ["angular", "jquery"];

		spyOn(Util, "getDirectoryNames").and.returnValue(mockProjects);

		const library = new BaseProjectLibrary("../test");
		expect(library.hasProject("angular")).toBe(true);
		expect(library.projectIds).toEqual(mockProjects);
		expect(Util.getDirectoryNames).toHaveBeenCalledWith(path.join("../test", "projects"));
		done();
	});

	it("gets correct custom templates", async done => {

		spyOn(Util, "getDirectoryNames").and.returnValues(["bar-chart", "combo"]);

		// spy on require(), https://coderwall.com/p/ck7w6g/spying-on-require-with-jasmine
		spyOn(require("module"), "_load").and.callFake((modulePath: string) => {
			if (modulePath.startsWith(path.join(__dirname, "custom-templates"))) {
				const folder = path.basename(modulePath);
				// tslint:disable-next-line:no-object-literal-type-assertion
				return {
					group: folder + "Group",
					id: folder,
					name: folder + "Name"
				};
			} else {
				fail("unexpected require");
			}
		});

		const library = new BaseProjectLibrary(__dirname);
		expect(library.getCustomTemplateNames()).toEqual(["bar-chartName", "comboName"]);
		done();
	});

	it("gets correct templates", async done => {
		spyOn(Util, "getDirectoryNames").and.returnValues(["bar-chart", "combo"], ["editors"]);

		// spy on require(), https://coderwall.com/p/ck7w6g/spying-on-require-with-jasmine
		spyOn(require("module"), "_load").and.callFake((modulePath: string) => {
			if (modulePath.startsWith(path.join(__dirname, "custom-templates"))) {
				const folder = path.basename(modulePath);
				// tslint:disable-next-line:no-object-literal-type-assertion
				return {
					group: folder + "CustomGroup",
					id: folder,
					name: folder + "CustomName"
				};
			}
			if (modulePath.startsWith(__dirname)) {
				const folder = path.basename(modulePath);
				// tslint:disable-next-line:no-object-literal-type-assertion
				return {
					group: folder + "Group",
					id: folder,
					name: folder + "Name",
					templates: folder + "Template"
				};
			} else {
				fail("unexpected require");
			}
		});

		const library = new BaseProjectLibrary(__dirname);
		spyOn(library, "customTemplates");
		expect(library.templates.length).toEqual(3);
		expect(library.templates[2].name).toEqual("comboCustomName");
		expect(library.components.length).toEqual(1);
		expect(library.components[0].name).toEqual("editorsName");
		done();
	});

	it("gets correct components", async done => {
		spyOn(Util, "getDirectoryNames").and.returnValues(["bar-chart", "combo"]);

		// spy on require(), https://coderwall.com/p/ck7w6g/spying-on-require-with-jasmine
		spyOn(require("module"), "_load").and.callFake((modulePath: string) => {
			if (modulePath.startsWith(__dirname)) {
				const folder = path.basename(modulePath);
				// tslint:disable-next-line:no-object-literal-type-assertion
				return {
					group: folder + "Group",
					name: folder + "Name"
				};
			} else {
				fail("unexpected require");
			}
		});

		const library = new BaseProjectLibrary(__dirname);
		expect(library.components.length).toEqual(2);
		expect(library.components[0].group).toEqual("bar-chartGroup");
		expect(library.components[1].name).toEqual("comboName");
		done();
	});

	it("gets template by id and name.", async done => {
		spyOn(Util, "getDirectoryNames").and.returnValues(["grid", "chart"], ["awesome"]);

		// spy on require(), https://coderwall.com/p/ck7w6g/spying-on-require-with-jasmine
		spyOn(require("module"), "_load").and.callFake((modulePath: string) => {
			if (modulePath.startsWith(path.join(__dirname, "custom-templates"))) {
				const folder = path.basename(modulePath);
				// tslint:disable-next-line:no-object-literal-type-assertion
				return {
					group: folder + "CustomGroup",
					id: folder,
					name: folder + "CustomName"
				};
			}
			if (modulePath.startsWith(__dirname)) {
				const folder = path.basename(modulePath);
				// tslint:disable-next-line:no-object-literal-type-assertion
				return {
					templates: {
						group: folder + "TemplateGroup",
						id: folder + "Template",
						name: folder + "TemplateName"
					}
				};
			} else {
				fail("unexpected require");
			}
		});

		const library = new BaseProjectLibrary(__dirname);

		//get templates by id
		expect(library.getTemplateById("gridTemplate")).toBeTruthy();
		expect(library.getTemplateById("gridtemplate")).toBeFalsy();
		expect(library.getTemplateById("awesome")).toBeTruthy();
		expect(library.getTemplateById("chartTemplate")).toBe(library.templates[1]);

		//get templates by name
		expect(library.getTemplateByName("gridTemplateName")).toBeTruthy();
		expect(library.getTemplateByName("gridtemplatename")).toBeFalsy();
		expect(library.getTemplateByName("awesomeCustomName")).toBeTruthy();
		expect(library.getTemplateByName("chartTemplateName")).toBe(library.templates[1]);
		done();
	});

	it("registers a template successfully.", async done => {
		spyOn(Util, "getDirectoryNames").and.returnValues(["grid", "chart"], ["awesome"]);

		// spy on require(), https://coderwall.com/p/ck7w6g/spying-on-require-with-jasmine
		spyOn(require("module"), "_load").and.callFake((modulePath: string) => {
			if (modulePath.startsWith(path.join(__dirname, "custom-templates"))) {
				const folder = path.basename(modulePath);
				// tslint:disable-next-line:no-object-literal-type-assertion
				return {
					group: folder + "CustomGroup",
					id: folder,
					name: folder + "CustomName"
				};
			}
			if (modulePath.startsWith(__dirname)) {
				const folder = path.basename(modulePath);
				// tslint:disable-next-line:no-object-literal-type-assertion
				return {
					templates: {
						components: { name: folder + "ComponentName"},
						group: folder + "TemplateGroup",
						id: folder + "Template",
						name: folder + "TemplateName"
					}
				};
			} else {
				fail("unexpected require");
			}
		});

		const library = new BaseProjectLibrary(__dirname);

		const mockTemplate: Template = library.templates[0];
		mockTemplate.components = ["newComponent"];
		mockTemplate.name = "newName";
		library.registerTemplate(mockTemplate);

		expect(library.getTemplateById("gridTemplate")).toBeTruthy();
		expect(library.getTemplateByName("newName")).toBeTruthy();
		expect(library.getComponentByName("newComponent")).toBeTruthy();
		expect(library.templates.length).toEqual(3);
		done();
	});

	it("gets [custom] component by name.", async done => {
		spyOn(Util, "getDirectoryNames").and.returnValues(["grid", "chart"], ["awesome"]);

		// spy on require(), https://coderwall.com/p/ck7w6g/spying-on-require-with-jasmine
		spyOn(require("module"), "_load").and.callFake((modulePath: string) => {
			if (modulePath.startsWith(path.join(__dirname, "custom-templates"))) {
				const folder = path.basename(modulePath);
				// tslint:disable-next-line:no-object-literal-type-assertion
				return {
					group: folder + "CustomGroup",
					id: folder,
					name: folder + "CustomName"
				};
			}
			if (modulePath.startsWith(__dirname)) {
				const folder = path.basename(modulePath);
				// tslint:disable-next-line:no-object-literal-type-assertion
				return {
						group: folder + "Group",
						name: folder + "Name"
				};
			} else {
				fail("unexpected require");
			}
		});

		const library = new BaseProjectLibrary(__dirname);

		//get components by name
		expect(library.getComponentByName("chartName")).toBeTruthy();
		expect(library.getComponentByName("chartname")).toBeFalsy();
		expect(library.getComponentByName("awesomeCustomName")).toBeFalsy();
		expect(library.getCustomTemplateByName("awesomeCustomName")).toBeTruthy();
		expect(library.getComponentByName("gridName")).toBe(library.components[0]);
		done();
	});

	it("gets correct component groups", async done => {
		spyOn(Util, "getDirectoryNames").and.returnValues(["myChart", "myCombo", "myGrid"]);

		spyOn(require("module"), "_load").and.callFake((modulePath: string) => {
			if (modulePath.startsWith(__dirname)) {
				const folder = path.basename(modulePath);
				return {
					group: folder + "Group"
				};
			} else {
				fail("unexpected require");
			}
		});

		const library = new BaseProjectLibrary(__dirname);
		expect(library.getComponentGroupNames()).toEqual(["myChartGroup", "myComboGroup", "myGridGroup"]);
		done();
	});

	it("gets correct component names by group", async done => {
		spyOn(Util, "getDirectoryNames").and.returnValues(["chart", "combo", "grid"]);

		spyOn(require("module"), "_load").and.callFake((modulePath: string) => {
				const folder = path.basename(modulePath);
				if (folder !== "grid") {
					return {
						description: "common description",
						group: "commonGroup",
						groupPriority: 1,
						name: folder,
						templates: []
					};
				}
				if (folder === "grid") {
					return {
						description: "grid description",
						group: folder + "Group",
						groupPriority: 2,
						name: folder,
						templates: []
					};
				} else {
					fail("unexpected require");
				}
		});
		const expectedCommonGroup: Component[] = [
			{ name: "chart", description: "common description", group: "commonGroup", groupPriority: 1, templates: [] },
			{ name: "combo", description: "common description", group: "commonGroup", groupPriority: 1, templates: [] }
		];

		const expectedGridGroup: Component[] = [
			{  name: "grid", description: "grid description", group: "gridGroup", groupPriority: 2, templates: [] }
		];
		const library = new BaseProjectLibrary(__dirname);

		expect(library.getComponentsByGroup("commonGroup")).toEqual(expectedCommonGroup);
		expect(library.getComponentsByGroup("gridGroup")).toEqual(expectedGridGroup);
		done();
	});

	it("should sort component in a group based on priority", async done => {
		spyOnProperty(BaseProjectLibrary.prototype, "components").and.returnValue([
			{ name: "Component1", group: "commonGroup", groupPriority: 1 },
			{ name: "Component2", group: "commonGroup", groupPriority: 20 },
			{ name: "Component3", group: "commonGroup", groupPriority: 13 },
			{ name: "Component4", group: "commonGroup", groupPriority: 4 },
			{ name: "Component5", group: "commonGroup", groupPriority: -4 },
			{ name: "Component6", group: "commonGroup", groupPriority: 0 },
			{ name: "Component7", group: "commonGroup", groupPriority: 0 }
		] as Component[]);

		const library = new BaseProjectLibrary(__dirname);
		expect(library.getComponentsByGroup("commonGroup").map(x => x.name)).toEqual(
			["Component2", "Component3", "Component4", "Component1", "Component6", "Component7", "Component5"]
		);
		done();
	});

	it("gets correct project", async done => {
		spyOn(Util, "getDirectoryNames").and.returnValues(["chart", "combo", "grid"]);

		spyOn(require("module"), "_load").and.callFake((modulePath: string) => {
			if (modulePath.startsWith(__dirname)) {
				const folder = path.basename(modulePath);
				return {
					group: folder + "Group"
				};
			} else {
				fail("unexpected require");
			}
		});
		const library = new BaseProjectLibrary(__dirname);

		expect(library.getProject("grid")).toBeTruthy();
		done();
	});

	it("has template.", async done => {
		spyOn(Util, "getDirectoryNames").and.returnValues(["chart", "combo", "grid"], ["customControl"]);

		spyOn(require("module"), "_load").and.callFake((modulePath: string) => {
			if (modulePath.startsWith(path.join(__dirname, "custom-templates"))) {
				const folder = path.basename(modulePath);
				// tslint:disable-next-line:no-object-literal-type-assertion
				return {
						id: folder + "Custom"
				};
			}
			if (modulePath.startsWith(__dirname)) {
				const folder = path.basename(modulePath);
				return {
					templates: {
						id: folder
					}
				};
			} else {
				fail("unexpected require");
			}
		});
		const library = new BaseProjectLibrary(__dirname);

		expect(library.hasTemplate("grid")).toBeTruthy();
		expect(library.hasTemplate("combo")).toBeTruthy();
		expect(library.hasTemplate("customControlCustom")).toBeTruthy();
		done();
	});
});
