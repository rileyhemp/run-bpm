<template>
	<v-hover v-ripple="false">
		<v-list-item
			class="actionable list-item"
			:class="
				is_selected && !is_locked
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
				><span v-if="!track.is_locked" class="text-right" style="width: 100%">{{ index + 1 }}</span
				><v-icon v-if="track.is_locked">mdi-lock</v-icon></v-list-item-icon
			>
			<v-list-item-content :class="$vuetify.breakpoint.smAndDown ? null : 'd-flex flex-row flex-nowrap'">
				<v-list-item-title>{{ track.track.name }}</v-list-item-title>
				<v-list-item-subtitle :class="$vuetify.breakpoint.smAndDown ? null : 'px-4'">{{ getArtist(track) }}</v-list-item-subtitle>
			</v-list-item-content>
			<div
				class="track-features"
				:class="$vuetify.breakpoint.smAndDown ? 'pl-4' : null"
				:style="$vuetify.breakpoint.mdAndUp ? 'flex: 0.5' : 'flex: .7'"
			>
				<v-list-item-subtitle :class="$vuetify.breakpoint.smAndDown ? 'text-right' : null">{{
					getTrackDuration(track)
				}}</v-list-item-subtitle>
				<v-list-item-subtitle class="ml-4" :class="$vuetify.breakpoint.smAndDown ? 'text-right' : null"
					>{{ track.features.doubletime }}{{ $vuetify.breakpoint.smAndDown ? null : "bpm" }}</v-list-item-subtitle
				>
				<v-list-item-subtitle class=" d-flex flex-nowrap" v-if="$vuetify.breakpoint.smAndUp">
					<v-list-item-subtitle class=" text-right mr-4">{{ getTrackKey(track) }}</v-list-item-subtitle>
					<v-list-item-subtitle style="max-width: 40px">{{ getTrackMode(track) }}</v-list-item-subtitle>
				</v-list-item-subtitle>
			</div>
		</v-list-item>
	</v-hover>
</template>

<script>
import msToHMS from "../scripts/msToHMS";
// import _ from "lodash";
export default {
	props: ["track", "index", "is_selected", "is_locked"],
	data: function() {
		return {
			// is_locked: this.track.is_locked,
			// is_selected: this.track.is_selected,
		};
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
			return msToHMS(track.track.duration_ms).split("00:")[1];
		},
		getTrackKey(track) {
			const scale = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
			return scale[track.features.key];
		},
		getTrackMode(track) {
			return track.features.mode ? "major" : "minor";
		},
		onClick(event) {
			this.$emit("onClick", { event: event, index: this.index });
		},
	},
};
</script>
<style lang="scss">
.sticky-row {
	position: sticky;
	top: 0;
	padding-top: 16px;
	padding-bottom: 8px;
	z-index: 101;
	background-color: #1e1e1e;
}
.controls-container {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	flex-wrap: wrap;
}
.controls-group {
	transform: translateY(-4px);
}
.track-features {
	display: flex;
	justify-content: space-between;
	flex: 1;
	/* @media screen and (min-width: 960px) {
		width: 35%;
	} */
}
.feature {
	/* margin-left: 8px; */
	/* text-align: right; */
	cursor: pointer;
}

.actionable {
	cursor: pointer;
}
.list-item-selected {
	/* background-color: rgba(255, 255, 255, 0.075); */
	background-color: rgba(41, 182, 246, 0.2);
	border-bottom: 0.5px solid rgba(0, 0, 0, 0.2);
	border-top: 0.5px solid rgba(0, 0, 0, 0.2);
}
.list-item-locked {
	opacity: 0.5;
	/* pointer-events: none; */
}
.locked-item-selected {
	/* pointer-events: none; */
	background-color: rgba(255, 255, 255, 0.05);
	border-bottom: 0.5px solid rgba(0, 0, 0, 0.2);
	border-top: 0.5px solid rgba(0, 0, 0, 0.2);
}
.v-list-item {
	padding: 0;
}
.on-hover {
	background-color: transparent;
	@media screen and (min-width: 960px) {
		background-color: rgba(41, 182, 246, 0.2);
	}
}
.v-list-item--link:before {
	background-color: transparent;
	@media screen and (min-width: 960px) {
		background-color: currentColor;
	}
}
</style>
