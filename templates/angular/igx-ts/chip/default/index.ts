import { IgniteUIForAngularTemplate } from "../../../../../lib/templates/IgniteUIForAngularTemplate";

class IgxChipTemplate extends IgniteUIForAngularTemplate {
	constructor() {
		super(__dirname);
		this.components = ["Chip"];
		this.controlGroup = "Data Entry & Display";
		this.listInComponentTemplates = true;
		this.id = "chip";
		this.projectType = "igx-ts";
		this.name = "Chip";
		this.description = "basic IgxChip";
		this.dependencies = [{
			import: ["IgxButtonModule", "IgxChipsModule", "IgxDropDownModule"],
			from: "igniteui-angular"
		}];
	}
}
module.exports = new IgxChipTemplate();
