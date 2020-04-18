<template>
	<div class="filter-container px-1 mt-2">
		<div class="overline" :class="collapsed ? 'no-margin' : null">
			{{ name }}
			<v-btn icon @click="tooltip = !tooltip">
				<v-icon>{{ tooltip ? "mdi-close-circle-outline" : "mdi-help-circle-outline" }}</v-icon>
			</v-btn>
			<p v-if="tooltip" @click="tooltip = false" class="overline" style="text-transform: none">
				{{
					name === "beats per minute"
						? "Beats per minute, or BPM, represents the speed of a track. Note: Tracks below 100 bpm are indexed in doubletime, meaning a selection of 160 will include tracks at both 80 and 160 bpm."
						: name === "energy"
						? "Represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale."
						: name === "instrumentalness"
						? "Predicts whether a track contains no vocals. The closer the instrumentalness value is to 100, the greater likelihood the track contains no vocal content. "
						: name === "danceability"
						? "	Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity."
						: name === "acousticness"
						? "A confidence measure from 0 to 100 of whether the track is acoustic."
						: name === "valence"
						? "Describes the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry)."
						: null
				}}
			</p>
		</div>
		<line-graph
			class="mt-3"
			:type="bars ? 'bar' : 'trend'"
			:height="height"
			v-if="this.chartReady"
			:chartData="this.chartData"
			:key="renderKey"
		/>
		<v-range-slider
			:min="range[0]"
			:max="range[1]"
			:dotSize="20"
			v-model="sliderRange"
			tooltip="none"
			color="cyan darken-3"
			:marks="sliderRange"
			@change="filterChartData"
		>
			<template v-slot:prepend>
				<v-text-field
					:value="sliderRange[0]"
					class="mt-0 pt-0"
					hide-details
					single-line
					type="number"
					style="width: 30px; transform: translateY(20px); position:absolute;"
					@change="$set(sliderRange, 0, $event)"
				></v-text-field>
			</template>
			<template v-slot:append>
				<v-text-field
					:value="sliderRange[1]"
					class="mt-0 pt-0"
					hide-details
					single-line
					type="number"
					style="width: 30px; transform: translateY(20px) translateX(-30px); position:absolute;"
					@change="$set(sliderRange, 1, $event)"
				></v-text-field> </template
		></v-range-slider>
	</div>
</template>

<script>
import LineGraph from "../components/LineGraph";
import gsap from "gsap";
import _ from "lodash";
import "vue-slider-component/theme/material.css";
export default {
	components: {
		"line-graph": LineGraph,
	},
	props: ["tracks", "name", "bars", "filter", "range", "segmentSize", "filters", "showMoreFilters", "chartData", "chartReady", "id", "renderKey"],
	data: function() {
		return {
			sliderRange: this.range,
			height: 80,
			collapsed: false,
			tooltip: false,
		};
	},
	methods: {
		collapse() {
			if (!this.collapsed) {
				gsap.to(this, {
					height: 0,
					duration: 0.2,
				});
				setTimeout(() => (this.collapsed = true), 175);
			} else {
				gsap.to(this, {
					height: 100,
					duration: 0.2,
				});
				this.collapsed = false;
			}
		},
		filterChartData: _.throttle(function() {
			//Emit event saying what changed, the scale it was using, and what the new values are.
			this.$emit("filterChartData", {
				range: this.sliderRange,
				scale: this.segmentSize,
				filter: this.filter,
			});
		}, 50),
	},
	mounted: function() {},
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
	min-width: 50%;
}
</style>
