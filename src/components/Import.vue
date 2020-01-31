<template>
	<v-container>
		<v-row class="ma-1">
			<v-btn text>Back</v-btn>
			<v-spacer />
			<v-btn color="primary" @click="getSongData">Continue</v-btn>
		</v-row>
		<v-row class="mx-1 mt-3" dense>
			<playlist-card
				v-for="playlist in this.$attrs.playlists.items"
				:key="playlist.id"
				:playlist="playlist"
				@click.native="selectPlaylist(playlist.id)"
			/>
		</v-row>
	</v-container>
</template>

<script>
import PlaylistCardVue from "./PlaylistCard.vue";
export default {
	name: "Import",
	components: {
		"playlist-card": PlaylistCardVue
	},
	data: function() {
		return {
			selected: [],
			trackDetails: []
		};
	},
	methods: {
		selectPlaylist(playlist) {
			const playlistIndex = this.selected.indexOf(playlist);
			if (playlistIndex != -1) {
				this.selected.splice(playlistIndex, 1);
			} else this.selected.push(playlist);
		},
		async getSongData() {
			let playlists = this.getPlaylistDetails();
			let i = setInterval(() => {
				if (playlists.length === this.selected.length) {
					this.getTrackDetails(this.getTrackIDs(playlists));
					clearInterval(i);
				}
			}, 25);
		},
		getPlaylistDetails() {
			let allTracks = [];
			this.selected.forEach(async el => {
				let tracks = await this.callSpotifyApi("getPlaylistTracks", el);
				allTracks.push(tracks.items);
			});
			return allTracks;
		},
		getTrackIDs(playlists) {
			let trackIDs = [];
			playlists.forEach(playlist =>
				playlist.forEach(track => trackIDs.push(track.track.id))
			);
			return trackIDs;
		},
		async getTrackDetails(tracks) {
			let trackDetails = await this.callSpotifyApi(
				"getAudioFeaturesForTracks",
				tracks
			);
			console.log("done");
			this.trackDetails = trackDetails;
		}
	}
};
</script>

