<template>
	<div class="radarChart"></div>
</template>

<script>
// import RadarChart from "../scripts/radarChart";
//eslint-disable-next-line
import { scale } from "d3/d3.min.js";
import RadarChart from "../scripts/radarChart";
const margin = { top: 50, right: 50, bottom: 50, left: 50 },
	width = Math.min(700, window.innerWidth - 50) - margin.left - margin.right,
	height = Math.min(
		width,
		window.innerHeight - margin.top - margin.bottom - 20
	);
export default {
	name: "radar-chart",
	props: ["chartData", "chartReady"],
	data: function() {
		return {
			chartOptions: {
				w: width,
				h: height,
				margin: margin,
				maxValue: 0.2,
				roundStrokes: true,
				color: scale.ordinal().range(["#EDC951", "#CC333F", "#00A0B0"])
			}
		};
	},
	mounted: function() {
		// RadarChart(".radarChart", this.passedData, this.chartOptions);
	},
	computed: {
		displayChart() {
			if (this.chartReady) {
				RadarChart(".radarChart", this.chartData, this.chartOptions);
			}
			return true;
		}
	}
};
</script>

<style>
.radarChart {
	text-align: center;
	cursor: default;
}
</style>