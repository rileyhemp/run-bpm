<template>
	<div class="radarChart"></div>
</template>

<script>
//eslint-disable-next-line
const margin = { top: 30, right: 50, bottom: 30, left: 50 },
	width = Math.min(700, window.innerWidth - 110) - margin.left - margin.right,
	height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);
import RadarChart from "@/scripts/radarChart";
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
				roundStrokes: true
				// color: scale
				// 	.ordinal()
				// 	.range([
				// 		colors.red.lighten2,
				// 		colors.red.lighten2,
				// 		colors.green.lighten2
				// 	])
			}
		};
	},
	mounted: function() {
		//Set graph's max value to highest value in the data set
		let values = [];
		this.chartData.forEach(el => values.push(el.value));
		this.chartOptions.maxValue = Math.max(...values);
		//Draw the chart
		RadarChart(".radarChart", this.chartData, this.chartOptions);
	}
};
</script>

<style>
.radarChart {
	text-align: center;
	cursor: default;
	position: relative;
	transform: translateY(-10px);
	z-index: 0;
}
</style>
