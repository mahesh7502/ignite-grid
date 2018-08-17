
import { BaseComponent } from "../../../../lib/BaseComponent";

class IgxRadialGaugeComponent extends BaseComponent {
	/**
	 *
	 */
	constructor() {
		super(__dirname);
		this.name  = "Radial Gauge";
		this.group = "Gauges";
		this.description = `provides a number of visual elements, like a needle, tick marks, ranges
							and labels, in order to create a predefined shape and scale.`;
	}
}
module.exports = new IgxRadialGaugeComponent();
