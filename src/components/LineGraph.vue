<template>
	<v-sparkline
		class="line-graph"
		:value="value"
		:labels="axis"
		:gradient="gradient"
		:smooth="radius || false"
		:padding="padding"
		:line-width="lineWidth"
		:stroke-linecap="lineCap"
		:gradient-direction="gradientDirection"
		:fill="fill"
		:auto-line-width="autoLineWidth"
		:auto-draw-duration="1000"
		:type="type"
		:height="height"
		:show-labels="showLabels"
		:label-size="labelSize"
	></v-sparkline>
</template>

<script>
const gradients = [
	["#222"],
	["#42b3f4"],
	["red", "orange", "yellow"],
	["purple", "violet"],
	["#00c6ff", "#F0F", "#FF0"],
	["#f72047", "#ffd200", "#1feaea"]
];
export default {
	props: ["chartData"],
	data: () => ({
		showLabels: false,
		height: 100,
		lineWidth: 4,
		labelSize: 10,
		radius: 2,
		padding: 8,
		lineCap: "round",
		gradient: gradients[5],
		value: [],
		axis: [],
		tracks: [],
		gradientDirection: "right",
		fill: false,
		type: "bar",
		duration: 2000,
		autoLineWidth: true
	}),
	mounted: function() {
		this.chartData[0].forEach(el => {
			this.value.push(el.value);
			this.axis.push(el.axis);
			this.tracks.push(el.tracks);
		});
	}
};
</script>

<style scoped>
.line-graph {
	margin-top: 40px;
	margin-bottom: 20px;
}
</style>