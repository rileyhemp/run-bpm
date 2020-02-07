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
	props: ["data"],
	data: function() {
		return {
			passedData: [
				[
					{ axis: "100", value: 0.22 },
					{ axis: "190", value: 0.3 },
					{ axis: "180", value: 0.25 },
					{ axis: "170", value: 0.5 },
					{ axis: "160", value: 0.21 },
					{ axis: "150", value: 0.02 },
					{ axis: "140", value: 0.22 },
					{ axis: "130", value: 0.17 },
					{ axis: "120", value: 0.29 },
					{ axis: "110", value: 0.28 }
				]
			],
			chartOptions: {
				w: width,
				h: height,
				margin: margin,
				maxValue: 1,
				// levels: 5,
				roundStrokes: true,
				color: scale.ordinal().range(["#EDC951", "#CC333F", "#00A0B0"])
			}
		};
	},

	mounted: function() {
		RadarChart(".radarChart", this.passedData, this.chartOptions);
	}
};
</script>

<style>
.radarChart {
	text-align: center;
	cursor: default;
}
</style>