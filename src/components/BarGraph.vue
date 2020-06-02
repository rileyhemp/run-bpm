<template>
	<div class="bar-graph">
		<transition name="expand" @enter="enter" v-for="(axis, index) in chartData" :key="index">
			>
			<div class="bar" :style="'height:' + getHeight(axis.tracks, multiplier) + '%'"
		/></transition>
	</div>
</template>

<script>
// const gradients = [
// 	["#222"],
// 	["#42b3f4"],
// 	["red", "orange", "yellow"],
// 	["purple", "violet"],
// 	["#00c6ff", "#F0F", "#FF0"],
// 	["#f72047", "#ffd200", "#1feaea"],
// ];
export default {
	props: ["chartData", "type", "height", "collapsed"],
	data: () => ({
		// height: 125,
	}),
	methods: {
		getHeight: function(value, multiplier) {
			return value * multiplier;
		},
		enter(element) {
			const width = getComputedStyle(element).width;

			element.style.width = width;
			element.style.position = "absolute";
			element.style.visibility = "hidden";
			element.style.height = "auto";

			const height = getComputedStyle(element).height;

			element.style.width = null;
			element.style.position = null;
			element.style.visibility = null;
			element.style.height = 0;

			// Force repaint to make sure the
			// animation is triggered correctly.
			getComputedStyle(element).height;

			// Trigger the animation.
			// We use `requestAnimationFrame` because we need
			// to make sure the browser has finished
			// painting after setting the `height`
			// to `0` in the line above.
			requestAnimationFrame(() => {
				element.style.height = height;
			});
		},
	},

	computed: {
		totalTracks: function() {
			let tracks = 0;
			this.chartData.forEach((element) => {
				tracks = tracks + element.tracks;
			});
			return tracks;
		},
		multiplier: function() {
			let arr = [];
			this.chartData.forEach((element) => {
				arr.push(element.tracks);
			});
			arr.sort((a, b) => {
				return b - a;
			});
			return 100 / arr[0];
		},
	},
	mounted: function() {
		// console.log(this.chartData);
	},
};
</script>

<style lang="scss" scoped>
.bar-graph {
	height: 125px;
	display: flex;
	align-items: flex-end;
}
.bar {
	width: 10%;
	margin: 0 6px;
	border-radius: 3px;
	background-color: white;
	height: 100%;
	transition: all 0.5s;
}
.expand-enter-active,
.expand-leave-active {
	transition: height 1s ease-in-out;
	overflow: hidden;
}

.expand-enter,
.expand-leave-to {
	height: 0;
}
</style>
