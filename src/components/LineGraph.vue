<template>
	<v-sparkline
		class="line-graph"
		:value="value"
		:labels="axis"
		:opacity="collapsed ? 0 : 1"
		:gradient="gradient"
		:smooth="this.type === 'trend' ? 12 : 2"
		:padding="padding"
		:line-width="this.type === 'trend' ? 5 : 2"
		:stroke-linecap="lineCap"
		:gradient-direction="gradientDirection"
		:fill="fill"
		:auto-line-width="this.type === 'trend' ? false : true"
		:type="this.type"
		:height="height"
		:show-labels="false"
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
	props: ["chartData", "type", "height", "collapsed"],
	data: () => ({
		showLabels: false,
		lineWidth: 4,
		labelSize: 10,
		padding: 8,
		lineCap: "round",
		gradient: gradients[5],
		value: [],
		axis: [],
		tracks: [],
		gradientDirection: "right",
		fill: false,
		duration: 2000
	}),
	mounted: function() {
		this.chartData.forEach(el => {
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
