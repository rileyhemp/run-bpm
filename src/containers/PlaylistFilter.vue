<template>
	<div class="filter-container" :class="collapsed ? 'mx-2 py-0 mt-2' : 'mx-2 pb-4 mb-8 pt-2'">
		<p class="overline" @click="collapse" :class="collapsed ? 'no-margin' : null">{{ name }}</p>
		<line-graph
			:collapsed="collapsed"
			:type="bars ? 'bar' : 'trend'"
			:height="height"
			v-if="this.chartReady"
			:chartData="this.chartData"
			:key="renderKey"
		/>
		<vue-slider
			v-show="!this.collapsed"
			:min="range[0]"
			:max="range[1]"
			v-model="sliderRange"
			tooltip="none"
			class="px-3 no-margin"
			:enable-cross="false"
			:marks="sliderRange"
			@drag-end="filterChartData"
		></vue-slider>
	</div>
</template>

<script>
import LineGraph from "../components/LineGraph";
import VueSlider from "vue-slider-component";
import gsap from "gsap";
import "vue-slider-component/theme/default.css";
export default {
	components: {
		"line-graph": LineGraph,
		VueSlider
	},
	props: ["tracks", "name", "bars", "filter", "range", "segmentSize", "filters", "chartData", "chartReady", "id", "renderKey"],
	data: function() {
		return {
			sliderRange: this.range,
			height: this.filter === "doubletime" ? 100 : 0,
			collapsed: this.filter === "doubletime" ? false : true
		};
	},
	methods: {
		collapse() {
			if (!this.collapsed) {
				gsap.to(this, {
					height: 0,
					duration: 0.2
				});
				setTimeout(() => (this.collapsed = true), 175);
			} else {
				gsap.to(this, {
					height: 100,
					duration: 0.2
				});
				this.collapsed = false;
			}
		},
		filterChartData: function() {
			this.$emit("filterChartData", {
				range: this.sliderRange,
				scale: this.segmentSize,
				filter: this.filter
			});
		}
	},
	mounted: function() {}
};
</script>

<style>
.no-margin {
	margin: 0 !important;
}
.line-graph {
	margin: 0 !important;
}
</style>