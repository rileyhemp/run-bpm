<template>
	<v-card absolute style="z-index: 1000" class="pa-4" :key="this.renderKey">
		<v-row class="sticky-row px-2">
			<v-spacer />
			<v-btn @click="close">Close</v-btn>
		</v-row>
		<v-list two-line class="mx-2 sticky-row sticky-list-item">
			<v-list-item>
				<v-btn icon large v-show="$vuetify.breakpoint.smAndDown"><v-icon light>mdi-select</v-icon></v-btn>
				<v-btn icon large :disabled="!tracksAreSelected" @click="lockSelected"><v-icon>mdi-lock</v-icon></v-btn>
				<v-btn icon large :disabled="!tracksAreSelected" @click="deleteSelected"><v-icon light>mdi-delete</v-icon></v-btn>
				<v-spacer></v-spacer>
				<div class="track-features">
					<div @click="sortBy('doubletime')" class="feature actionable overline">BPM</div>
					<div @click="sortBy('energy')" class="feature actionable overline">ENRG</div>
					<div @click="sortBy('instrumentalness')" class="feature actionable overline">INST</div>
					<div @click="sortBy('danceability')" class="feature actionable overline">DANC</div>
					<div @click="sortBy('acousticness')" class="feature actionable overline">ACST</div>
					<div @click="sortBy('valence')" class="feature actionable overline">VLNC</div>
				</div>
			</v-list-item>
		</v-list>
		<v-list two-line class="mx-2">
			<v-hover v-slot:default="{ hover }" v-for="track in tracks" :key="track.id">
				<v-list-item
					class="actionable"
					:class="track.is_selected ? 'list-item-selected' : null"
					@click="select(tracks.indexOf(track))"
					v-ripple="false"
				>
					<v-icon class="mr-2" v-if="track.is_locked">mdi-lock</v-icon>
					<v-list-item-icon class="mx-0" v-if="!track.is_locked">{{ sortedPlaylist.indexOf(track) + 1 }}</v-list-item-icon>
					<v-list-item-content>
						<v-list-item-title>{{ track.track.name }}</v-list-item-title>
						<v-list-item-subtitle>{{ getArtist(track) }}</v-list-item-subtitle>
					</v-list-item-content>
					<div class="track-features ">
						<div class="feature">{{ track.features.doubletime }}</div>
						<div class="feature">{{ getValue(track.features.energy) }}</div>
						<div class="feature">{{ getValue(track.features.instrumentalness) }}</div>
						<div class="feature">{{ getValue(track.features.danceability) }}</div>
						<div class="feature">{{ getValue(track.features.acousticness) }}</div>
						<div class="feature">{{ getValue(track.features.valence) }}</div>
					</div>
				</v-list-item>
			</v-hover>
		</v-list>
	</v-card>
</template>

<script>
import msToHMS from "../scripts/msToHMS";
import _ from "lodash";
export default {
	props: ["playlist", "tracks"],
	data: function() {
		return {
			sortMethod: "default",
			sortedPlaylist: this.tracks,
			renderKey: 1,
			altRenderKey: 1,
			selectedTracks: [],
			tracksAreSelected: false,
		};
	},
	computed: {
		mixDuration: function() {
			let totalLength = 0;
			this.tracks.forEach((track) => {
				totalLength += track.track.duration_ms;
			});
			//Convert time in ms to hours minutes seconds and return
			return msToHMS(totalLength);
		},
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
		close() {
			this.$emit("close");
		},
		sortBy(property) {
			let list = this.tracks;
			let direction = null;
			if (this.sortMethod === property + "HightToLow") {
				list.sort((a, b) => (a.features[property] < b.features[property] ? 1 : -1));
				direction = "LowToHigh";
			} else {
				list.sort((a, b) => (a.features[property] > b.features[property] ? 1 : -1));
				direction = "HightToLow";
			}
			this.sortedPlaylist = list;
			this.sortMethod = property + direction;
			this.renderKey++;
		},
		deleteSelected() {
			_.pullAll(this.sortedPlaylist, this.selectedTracks);
			this.deselectAll();
		},
		select(index) {
			this.sortedPlaylist[index].is_selected = !this.sortedPlaylist[index].is_selected;
			let id = this.sortedPlaylist[index];
			this.selectedTracks.includes(id) ? (this.selectedTracks = _.pull(this.selectedTracks, id)) : this.selectedTracks.push(id);
			this.tracksAreSelected = this.selectedTracks.length > 0;
		},
		lockSelected() {
			for (let i = 0; i < this.selectedTracks.length; i++) {
				let index = this.sortedPlaylist.indexOf(this.selectedTracks[i]);
				this.sortedPlaylist[index].is_locked = !this.sortedPlaylist[index].is_locked;
			}
			this.deselectAll();
		},
		deselectAll() {
			for (let i = 0; i < this.sortedPlaylist.length; i++) {
				this.sortedPlaylist[i].is_selected = false;
			}
			this.selectedTracks = [];
			this.tracksAreSelected = false;
			this.renderKey++;
		},
	},
};
</script>
<style>
.sticky-row {
	position: sticky;
	top: 16px;
	z-index: 101;
}
.sticky-list-item {
	top: 0px;
	margin-top: -64px;
	background-color: #1e1e1e;
	z-index: 100;
	padding-top: 64px;
}
.track-features {
	display: flex;
	width: 35%;
	justify-content: space-between;
}
.feature {
	margin-left: 8px;
	text-align: right;
	cursor: pointer;
}
.actionable {
	cursor: pointer;
}
.list-item-selected {
	background-color: rgba(255, 255, 255, 0.05);
	border-bottom: 0.5px solid rgba(0, 0, 0, 0.2);
	border-top: 0.5px solid rgba(0, 0, 0, 0.2);
}
</style>
