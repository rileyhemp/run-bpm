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
				w: width + 50,
				h: height + 50,
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
			},
			formattedData: []
		};
	},
	mounted: function() {
		Object.entries(this.chartData).forEach(el => {
			this.formattedData.push(el[1]);
		});
		//Set graph's max value to highest value in the data set
		let values = [];
		this.chartData.doubletime.forEach(el => values.push(el.value));

		this.chartOptions.maxValue = Math.max(...values);
		//Draw the chart
		RadarChart(".radarChart", this.formattedData, this.chartOptions);
		let radarAreas = document.querySelectorAll(".radarArea");
		for (let i = 0; i < radarAreas.length; i++) {
			radarAreas[i].addEventListener("mousedown", () => this.$emit("chartClicked", event));
		}
	}
};
</script>

<style>
.radarChart {
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	cursor: default;
	position: relative;
	transform: translateY(-10px);
	z-index: 0;
}
.legend {
	color: white;
}
</style>
