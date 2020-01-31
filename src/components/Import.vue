<template>
	<v-container>
		<v-row class="ma-1">
			<v-btn text>Back</v-btn>
			<v-spacer />
			<v-btn
				color="primary"
				:to="{ name: 'Create', params: { playlists: this.selectedPlaylists }}"
			>Continue</v-btn>
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
			selectedPlaylists: []
		};
	},
	methods: {
		selectPlaylist(playlist) {
			const playlistIndex = this.selectedPlaylists.indexOf(playlist);
			if (playlistIndex != -1) {
				this.selectedPlaylists.splice(playlistIndex, 1);
			} else this.selectedPlaylists.push(playlist);
		}
		// getSongData() {
		// 	this.loading = true;
		// 	let playlists = this.getPlaylistDetails();
		// 	//Wait until playlist details populate, then get track details from ids.
		// 	let i = setInterval(() => {
		// 		if (playlists.length === this.selected.length) {
		// 			this.getTrackDetails(this.getTrackIDs(playlists));
		// 			clearInterval(i);
		// 		}
		// 	}, 25);
		// },
		// getTrackIDs(playlists) {
		// 	//extract the track ids from the playlist details
		// 	let trackIDs = [];
		// 	playlists.forEach(playlist =>
		// 		playlist.forEach(track => trackIDs.push(track.track.id))
		// 	);
		// 	return trackIDs;
		// },
		// getPlaylistDetails() {
		// 	let allTracks = [];
		// 	this.selected.forEach(async el => {
		// 		let tracks = await this.callSpotifyApi("getPlaylistTracks", el);
		// 		allTracks.push(tracks.items);
		// 	});
		// 	return allTracks;
		// },
		// async getTrackDetails(tracks) {
		// 	let chunkedArrays = _.chunk(tracks, 50);
		// 	let allDetails = [];
		// 	chunkedArrays.forEach(async arr => {
		// 		let details = await this.callSpotifyApi(
		// 			"getAudioFeaturesForTracks",
		// 			arr
		// 		);
		// 		allDetails.push(details);
		// 		this.trackDetails = _.flatten(allDetails);
		// 		_.flatten(this.trackDetails);
		// 	});
		// }
	}
};
//
</script>
