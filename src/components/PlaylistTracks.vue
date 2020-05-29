<template>
	<v-card absolute style="z-index: 1000" class="pa-4">
		<v-row class="sticky-row px-2">
			<v-spacer />
			<v-btn @click="close">Close</v-btn>
		</v-row>
		<v-list two-line class="mx-2">
			<v-list-item-subtitle class="mx-4"></v-list-item-subtitle>
			<v-list-item v-for="track in tracks" :key="track.id">
				<v-list-item-icon class="mx-0">{{ tracks.indexOf(track) + 1 }}</v-list-item-icon>
				<v-list-item-content>
					<v-list-item-title>{{ track.track.name }}</v-list-item-title>
					<v-list-item-subtitle>{{ getArtist(track) }}</v-list-item-subtitle>
				</v-list-item-content>
			</v-list-item>
		</v-list>
	</v-card>
</template>

<script>
import msToHMS from "../scripts/msToHMS";
export default {
	props: ["playlist", "tracks"],
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
		close() {
			this.$emit("close");
		},
	},
};
</script>
<style>
.sticky-row {
	position: sticky;
	top: 16px;
}
</style>
