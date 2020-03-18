<template>
	<v-row class="d-flex align-center flex-nowrap playlist mx-4" @click="dialog = true" v-ripple v-if="playlistDetails != undefined">
		<v-img :src="playlistDetails.images[0].url" :height="50" :width="50" />
		<v-list-item class="pr-1">
			<v-list-item-content>
				<v-list-item-title>{{ playlist.metadata.name }}</v-list-item-title>
				<v-list-item-subtitle>{{ getPlaylistInfo(playlist) }}</v-list-item-subtitle>
			</v-list-item-content>
			<delete-playlist :playlist="playlist.id" @updatePlaylists="updatePlaylists" />
		</v-list-item>
		<v-dialog v-model="dialog" max-width="300">
			<v-card>
				<v-card-title class="headline">{{ playlist.metadata.name }}</v-card-title>
				<v-card-actions>
					<v-btn-toggle borderless class="d-flex flex-column">
						<v-btn text block class="plain-btn justify-start" @click="goToPlaylist">
							<v-icon class="mr-2">mdi-cellphone</v-icon>

							<span>Play on Spotify</span>
						</v-btn>
					</v-btn-toggle>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-row>
</template>

<script>
import DeletePlaylist from "../components/DeletePlaylist";

export default {
	props: ["playlist"],
	components: {
		"delete-playlist": DeletePlaylist
	},
	data: function() {
		return {
			dialog: false,
			active: false
		};
	},
	computed: {
		devices: function() {
			return this.$attrs.userDevices.devices;
		},
		playlistDetails: function() {
			let playlist;
			this.$attrs.userPlaylists.items.forEach(el => {
				if (this.playlist.id === el.id) {
					playlist = el;
				}
			});
			return playlist;
		}
	},
	methods: {
		goToPlaylist() {
			window.open("https://open.spotify.com/playlist/" + this.playlist.id, "_blank");
		},
		updatePlaylists() {
			this.refreshDevices();
			this.$emit("updatePlaylists");
		},
		getPlaylistInfo(playlist) {
			return this.nowPlaying === playlist.id ? "Now playing..." : playlist.metadata.tracks + " Tracks, " + playlist.metadata.duration;
		}
	}
};
</script>

<style scoped>
.playlist {
	border-bottom: 1px solid grey;
	display: flex;
}
.playlist-details {
	padding-right: 0;
}
/* .v-btn-toggle {
	flex-direction: column;
	flex: 1;
}
.justify-start {
	justify-content: start;
} */
.plain-btn:hover:before {
	background-color: transparent;
}
/* .disable-events {
	pointer-events: none;
} */
</style>
