<template>
	<v-card>
		<v-card-actions class="justify-end">
			<v-btn text color="secondary" @click="close"><v-icon>mdi-close</v-icon></v-btn>
		</v-card-actions>
		<v-card-title>{{ playlist.name }}</v-card-title>
		<v-card-subtitle>{{ playlist.description }}</v-card-subtitle>
		<v-list two-line class="mx-2">
			<v-list-item-subtitle class="mx-4">{{ tracks.length }} tracks {{ mixDuration }}</v-list-item-subtitle>
			<v-list-item v-for="track in tracks" :key="track.id">
				<v-list-item-icon class="mx-0">{{ tracks.indexOf(track) + 1 }}:</v-list-item-icon>
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
			this.tracks.forEach(track => {
				totalLength += track.track.duration_ms;
			});
			//Convert time in ms to hours minutes seconds and return
			return msToHMS(totalLength);
		}
	},
	methods: {
		getArtist(track) {
			const artists = track.track.artists;
			let names = [];
			if (artists.length > 1) {
				artists.forEach(el => {
					names.push(el.name);
				});
				return names.join(", ");
			}
			return artists[0].name;
		},
		close() {
			this.$emit("close");
		}
	}
};
</script>
