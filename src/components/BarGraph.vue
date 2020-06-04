<template>
	<div class="bar-graph">
		<v-tooltip bottom v-for="(axis, index) in chartData" :key="index">
			<template v-slot:activator="{ on }">
				<div
					v-on="$vuetify.breakpoint.mdAndUp && on"
					class="bar"
					:style="'height: ' + getHeight(axis.tracks, multiplier) + '%'"
					:class="'gradient-' + index"
				/>
			</template>
			<span>{{ axis.tracks }} tracks</span>
		</v-tooltip>
	</div>
</template>

<script>
export default {
	props: ["chartData", "type", "height", "collapsed"],
	data: () => ({
		// height: 125,
	}),
	methods: {
		getHeight: function(value, multiplier) {
			const height = value * multiplier;
			//Set minimum height for bar
			return height < 3 && height > 0 ? 3 : height;
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
	margin-bottom: 8px;
}
.bar {
	width: 10%;
	margin: 0 0.8%;
	border-radius: 3px;
	height: 100%;
	transition: all 0.5s 0.05s ease;
	@media screen and (min-width: 768px) {
		margin: 0 1.3%;
	}
}

.gradient-9 {
	background: linear-gradient(360deg, #f83d3b 0%, #f72744 100%);
}
.gradient-8 {
	background: linear-gradient(360deg, #fa612d 0%, #f94b35 100%);
}
.gradient-7 {
	background: linear-gradient(360deg, #d7721a 0%, #fb6e28 100%);
}
.gradient-6 {
	background: linear-gradient(360deg, #fda810 0%, #fd921a 100%);
}
.gradient-5 {
	background: linear-gradient(360deg, #ffcc02 0%, #feb50c 100%);
}
.gradient-4 {
	background: linear-gradient(360deg, #dad627 0%, #f7d308 100%);
}
.gradient-3 {
	background: linear-gradient(360deg, #adda55 0%, #cad838 100%);
}
.gradient-2 {
	background: linear-gradient(360deg, #54e4b2 0%, #6fe196 100%);
}
.gradient-1 {
	background: linear-gradient(360deg, #54e4b2 0%, #6ee298 100%);
}
.gradient-0 {
	background: linear-gradient(360deg, #27e9e1 0%, #44e6c5 100%);
}
</style>
