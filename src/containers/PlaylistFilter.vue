<template>
	<div class="filter-container px-1 mt-2">
		<div class="overline" style="position:relative">
			{{ name }}
			<v-btn icon @click="tooltip = !tooltip">
				<v-icon>{{ tooltip ? "mdi-close-circle-outline" : "mdi-help-circle-outline" }}</v-icon>
			</v-btn>
			<p v-if="tooltip" @click="tooltip = false" class="body-2 filter-tooltip">
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
		<bar-graph class="mt-3" :type="bars ? 'bar' : 'trend'" :height="height" v-if="this.chartReady" :chartData="this.chartData" />
		<v-range-slider
			:min="range[0]"
			:max="range[1]"
			v-model="sliderRange"
			:thumb-size="50"
			tooltip="none"
			color="none"
			:marks="sliderRange"
			@input="filterChartData"
		>
		</v-range-slider>
		<v-row style="transform: translateY(-30px)">
			<v-col :cols="$vuetify.breakpoint.xsOnly ? 3 : $vuetify.breakpoint.smAndUp ? 3 : null">
				<v-text-field
					:value="sliderRange[0]"
					class="mt-0 pt-0"
					hide-details
					single-line
					:type="$vuetify.breakpoint.mdAndUp ? 'text' : 'number'"
					@change="$set(sliderRange, 0, $event)"
					flat
					solo-inverted
					:style="$vuetify.breakpoint.mdAndUp ? 'pointer-events:none' : null"
				></v-text-field>
			</v-col>
			<v-spacer />
			<v-col :cols="$vuetify.breakpoint.xsOnly ? 3 : $vuetify.breakpoint.smAndUp ? 3 : null">
				<v-text-field
					:value="sliderRange[1]"
					class="mt-0 pt-0"
					hide-details
					single-line
					:type="$vuetify.breakpoint.mdAndUp ? 'text' : 'number'"
					@change="$set(sliderRange, 1, $event)"
					flat
					solo-inverted
					reverse
					:style="$vuetify.breakpoint.mdAndUp ? 'pointer-events:none' : null"
				></v-text-field>
			</v-col>
		</v-row>
	</div>
</template>

<script>
// import LineGraph from "../components/LineGraph";
import BarGraph from "../components/BarGraph";
// import gsap from "gsap";
import _ from "lodash";
import "vue-slider-component/theme/material.css";
export default {
	components: {
		// "line-graph": LineGraph,
		"bar-graph": BarGraph,
	},
	props: ["name", "bars", "filter", "range", "segmentSize", "filters", "showMoreFilters", "chartData", "chartReady", "id"],
	data: function() {
		return {
			sliderRange: this.range,
			height: 80,
			tooltip: false,
		};
	},
	methods: {
		filterChartData: _.throttle(function() {
			//Emit event saying what changed, the scale it was using, and what the new values are.
			this.$emit("filterChartData", {
				range: this.sliderRange,
				scale: this.segmentSize,
				filter: this.filter,
			});
		}, 100),
	},
	mounted: function() {},
};
</script>

<style lang="scss">
.no-margin {
	margin: 0 !important;
}
.line-graph {
	margin: 0 !important;
}
.filter-container {
	min-width: 100%;
}

.filter-tooltip {
	text-transform: none;
	position: absolute;
	background-color: #1e1e1e;
	line-height: 1.5rem;
	padding: 8px;
	border-radius: 3px;
	cursor: pointer;
	z-index: 101;
}

@media screen and (min-width: 600px) {
	.filter-container {
		min-width: 50%;
		max-width: 50%;
	}
}
@media screen and (min-width: 1400px) {
	.filter-container {
		min-width: 33%;
		max-width: 33%;
	}
}
.theme--dark.v-text-field--solo > .v-input__control > .v-input__slot {
	background: transparent;
}
</style>
