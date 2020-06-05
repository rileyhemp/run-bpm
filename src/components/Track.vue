<template>
	<v-list-item
		class="actionable list-item"
		:class="
			is_header
				? 'no-hover header pt-4'
				: is_selected && !is_locked
				? 'list-item-selected'
				: is_selected && is_locked
				? 'locked-item-selected'
				: !is_selected && is_locked
				? 'list-item-locked'
				: null
		"
		@click="onClick"
		v-ripple="false"
	>
		<v-list-item-icon class="ml-0 mr-2"
			><span v-if="!track.is_locked" class="text-right" style="width: 100%" v-show="!is_header">{{ index + 1 }}</span
			><v-icon v-if="track.is_locked">mdi-lock</v-icon></v-list-item-icon
		>
		<v-list-item-content :class="$vuetify.breakpoint.smAndDown ? null : 'd-flex flex-row flex-nowrap'">
			<v-list-item-title
				><span class="feature">{{ is_header ? "Name" : track.track.name }}</span></v-list-item-title
			>
			<v-list-item-subtitle :class="$vuetify.breakpoint.smAndDown ? null : 'px-4'"
				><span class="feature">{{ is_header ? "Artist" : getArtist(track) }}</span></v-list-item-subtitle
			>
		</v-list-item-content>
		<div
			class="track-features"
			:class="$vuetify.breakpoint.smAndDown ? 'pl-4' : null"
			:style="$vuetify.breakpoint.mdAndUp ? 'flex: 0.5' : 'flex: 1'"
		>
			<v-list-item-subtitle v-if="selectedFilters.includes(0)"
				><span class="feature">{{ is_header ? "Duration" : getTrackDuration(track) }}</span>
			</v-list-item-subtitle>

			<v-list-item-subtitle v-if="selectedFilters.includes(1)"
				><span class="feature" v-if="!is_header"
					>{{ track.features.doubletime }}{{ $vuetify.breakpoint.smAndDown || is_header ? null : " bpm" }}</span
				>
				<span class="feature" v-if="is_header">Tempo<br />(Doubletime)</span>
			</v-list-item-subtitle>

			<v-list-item-subtitle v-if="selectedFilters.includes(2)"
				><span class="feature" v-if="!is_header"
					>{{ track.features.tempo }}{{ $vuetify.breakpoint.smAndDown || is_header ? null : " bpm" }}</span
				>
				<span class="feature" v-if="is_header">Tempo<br />(Original)</span>
			</v-list-item-subtitle>

			<v-list-item-subtitle class=" d-flex flex-nowrap" v-if="selectedFilters.includes(8)">
				<span class="text-right mr-4" style="width: 30%"
					><span class="feature" :class="is_header === true ? 'track-key' : null">{{ getTrackKey(track) }}</span></span
				>
				<span style="max-width: 40px"
					><span class="feature">{{ getTrackMode(track) }}</span></span
				>
			</v-list-item-subtitle>

			<v-list-item-subtitle v-if="selectedFilters.includes(4)"
				><span class="feature">{{ is_header ? "Energy" : getValue(track.features.energy) }}</span>
			</v-list-item-subtitle>

			<v-list-item-subtitle v-if="selectedFilters.includes(5)"
				><span class="feature">{{ is_header ? "Instrumentalness" : getValue(track.features.instrumentalness) }}</span>
			</v-list-item-subtitle>

			<v-list-item-subtitle v-if="selectedFilters.includes(6)"
				><span class="feature">{{ is_header ? "Danceability" : getValue(track.features.danceability) }}</span>
			</v-list-item-subtitle>

			<v-list-item-subtitle v-if="selectedFilters.includes(7)"
				><span class="feature">{{ is_header ? "Acousticness" : getValue(track.features.acousticness) }}</span>
			</v-list-item-subtitle>

			<v-list-item-subtitle v-if="selectedFilters.includes(3)"
				><span class="feature">{{ is_header ? "Valence" : getValue(track.features.valence) }}</span>
			</v-list-item-subtitle>
		</div>
	</v-list-item>
</template>

<script>
import msToHMS from "../scripts/msToHMS";
// import _ from "lodash";
export default {
	props: ["track", "index", "is_selected", "is_locked", "is_header", "selectedFilters"],
	data: function() {
		return {};
	},
	methods: {
		getArtist(track) {
			const artists = track.track.artists;
			let names = [];
			if (artists.length > 1) {
				artists.forEach((el) => {
					names.push(el.name);
				});
				return names.join(", ");
			}
			return artists[0].name;
		},
		getValue(value) {
			return Math.floor(value.toFixed(2) * 100);
		},
		getTrackDuration(track) {
			if (!this.is_header) {
				return msToHMS(track.track.duration_ms).split("00:")[1];
			} else return "Duration";
		},
		getTrackKey(track) {
			const scale = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
			return this.is_header ? "Key" : scale[track.features.key];
		},
		getTrackMode(track) {
			return this.is_header ? "Mode" : track.features.mode ? "major" : "minor";
		},
		onClick(event) {
			this.$emit("onClick", { event: event, index: this.index });
		},
	},
};
</script>
<style lang="scss">
.header {
	position: sticky;
	top: 0;
	background-color: #1e1e1e;
	z-index: 101;
}
.track-features {
	display: flex;
	justify-content: space-between;
	flex: 1;
}
.feature {
	cursor: pointer;
}
.track-key {
	position: absolute;
	overflow: visible;
	transform: translateX(-21px);
	&:after {
		content: "/";
		position: absolute;
		left: 27px;
		pointer-events: none;
	}
}
.actionable {
	cursor: pointer;
}
.list-item-selected {
	background-color: rgba(41, 182, 246, 0.2);
	border-bottom: 0.5px solid rgba(0, 0, 0, 0.2);
	border-top: 0.5px solid rgba(0, 0, 0, 0.2);
}
.list-item-locked {
	opacity: 0.5;
}
.locked-item-selected {
	background-color: rgba(255, 255, 255, 0.05);
	border-bottom: 0.5px solid rgba(0, 0, 0, 0.2);
	border-top: 0.5px solid rgba(0, 0, 0, 0.2);
}
.v-list-item--link:before {
	background-color: transparent;
	@media screen and (min-width: 960px) {
		background-color: currentColor;
	}
}
</style>
