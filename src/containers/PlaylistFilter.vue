<template>
	<div
		class="filter-container"
		:class="collapsed ? 'mx-4 py-0 mt-2' : 'mx-4 pb-4 mb-8 pt-2'"
		v-show="name === 'beats per minute' || showMoreFilters"
	>
		<p class="overline" :class="collapsed ? 'no-margin' : null">
			{{ name }}

			<v-btn icon v-show="name === 'valence'" v-if="!tooltip" @click="tooltip = true">
				<v-icon>mdi-help-circle-outline</v-icon>
			</v-btn>
			<span v-if="tooltip" @click="tooltip = false" class="overline">: Describes the musical positiveness conveyed by a track. </span>
		</p>
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
			:dotSize="20"
			v-model="sliderRange"
			tooltip="none"
			class="px-3 no-margin"
			:enable-cross="false"
			:marks="sliderRange"
			@change="filterChartData"
		></vue-slider>
	</div>
</template>

<script>
import LineGraph from "../components/LineGraph";
import VueSlider from "vue-slider-component";
import gsap from "gsap";
import _ from "lodash";
import "vue-slider-component/theme/material.css";
export default {
	components: {
		"line-graph": LineGraph,
		VueSlider
	},
	props: ["tracks", "name", "bars", "filter", "range", "segmentSize", "filters", "showMoreFilters", "chartData", "chartReady", "id", "renderKey"],
	data: function() {
		return {
			sliderRange: this.range,
			height: 80,
			collapsed: false,
			tooltip: false
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
		filterChartData: _.throttle(function() {
			//Emit event saying what changed, the scale it was using, and what the new values are.
			this.$emit("filterChartData", {
				range: this.sliderRange,
				scale: this.segmentSize,
				filter: this.filter
			});
		}, 50)
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
.filter-container {
	min-width: 45%;
}
</style>
