<template>
	<v-list-item
		class="actionable list-item pr-2"
		:class="
			is_header
				? 'no-hover header pb-3'
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
			<v-list-item-title class="pr-4">
				<span v-if="is_header" class="feature" @click="onSort('name')">Title</span>
				<span v-if="!is_header">{{ track.track.name }}</span>
			</v-list-item-title>

			<v-list-item-subtitle class="pr-4">
				<span v-if="is_header" class="feature" @click="onSort('artist')">Artist</span>
				<span v-if="!is_header">{{ getArtist(track) }}</span>
			</v-list-item-subtitle>
		</v-list-item-content>
		<div class="track-features">
			<v-list-item-subtitle v-for="(filter, index) in selectedFilters" :key="index + 1" class="feature-container">
				<span v-if="filters[filter].id != 'key'">
					<span v-if="is_header" class="feature" @click="onSort(filters[filter].id)">{{ filters[filter].text.split(" ")[0] }}</span>
					<span v-if="!is_header">{{ getValue(filters[filter].id) }}</span>
				</span>
				<p
					class="feature-second-line"
					v-if="(is_header && filters[filter].id === 'doubletime') || (filters[filter].id === 'tempo' && is_header)"
					@click="onSort(filters[filter].id)"
				>
					{{ filters[filter].text.split(" ")[1] }}
				</p>
				<span v-if="filters[filter].id === 'key'" class="pl-4">
					<span v-if="is_header" class="feature track-key" @click="onSort('key')">Key</span>
					<span v-if="is_header" class="feature ml-9" @click="onSort('mode')">Mode</span>
					<span v-if="!is_header">{{ getValue("key") }}</span>
					<span v-if="!is_header" class="pl-1">{{ getValue("mode") }}</span>
				</span>
			</v-list-item-subtitle>
		</div>
		<!-- <v-list-item-content :class="$vuetify.breakpoint.smAndDown ? null : 'd-flex flex-row flex-nowrap'">
			<v-list-item-title
				><span class="feature">{{ is_header ? "Name" : track.track.name }}</span></v-list-item-title
			>
			<v-list-item-subtitle :class="$vuetify.breakpoint.smAndDown ? null : 'px-4'" style="flex-shrink: 1.2"
				><span class="feature">{{ is_header ? "Artist" : getArtist(track) }}</span></v-list-item-subtitle
			>
		</v-list-item-content>
		<div
			class="track-features"
			:class="$vuetify.breakpoint.smAndDown ? 'pl-4' : null"
			:style="$vuetify.breakpoint.mdAndUp ? 'flex: .8' : 'flex: 1'"
		>
			<v-list-item-subtitle
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
		</div> -->
	</v-list-item>
</template>

<script>
import msToHMS from "../scripts/msToHMS";
// import _ from "lodash";
export default {
	props: ["track", "index", "is_selected", "is_locked", "is_header", "selectedFilters", "filters"],
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
		getValue(feature) {
			let value = this.track.features[feature];
			let result;
			switch (feature) {
				case "duration_ms":
					result = this.getTrackDuration(value);
					break;

				case "doubletime":
					result = value + " bpm";
					break;
				case "tempo":
					result = value + "bpm";
					break;
				case "key":
					result = this.getTrackKey(value);
					break;
				case "mode":
					result = this.getTrackMode(value);
					break;
				default:
					result = Math.floor(value * 100);
			}
			return result;
		},
		getTrackDuration(value) {
			return msToHMS(value).split("00:")[1];
		},
		getTrackKey(value) {
			const scale = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
			return scale[value];
		},
		getTrackMode(value) {
			return value ? "major" : "minor";
		},
		onClick(event) {
			this.$emit("onClick", { event: event, index: this.index });
		},
		onSort(target) {
			console.log(target);
			this.$emit("onSort", { event: target });
		},
	},
};
</script>
<style lang="scss">
.header {
	position: sticky;
	top: 84px;
	background-color: #1e1e1e;
	z-index: 99;
}
.track-features {
	display: flex;
	width: 100%;
	justify-content: space-between;
	flex: 0.7;
}
.feature {
	cursor: pointer;
	display: block;
	text-align: left;
}
.feature-container {
	display: flex;
	justify-content: flex-end;
	max-width: 70px;
}
.feature-second-line {
	position: absolute;
	transform: translateY(20px);
	cursor: pointer;
}
.header .feature {
	/* position: absolute; */
}

.track-key {
	position: absolute;
	overflow: visible;
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
