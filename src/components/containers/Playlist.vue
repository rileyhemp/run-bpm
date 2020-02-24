<template>
	<v-row class="d-flex align-center flex-nowrap playlist mx-4" @click="dialog=true" v-ripple>
		<v-img :src="playlistDetails.images[0].url" :height="50" :width="50" />
		<v-list-item class="pr-1">
			<v-list-item-content>
				<v-list-item-title>{{playlist.metadata.name}}</v-list-item-title>
				<v-list-item-subtitle>{{getPlaylistInfo(playlist)}}</v-list-item-subtitle>
			</v-list-item-content>
			<delete-playlist :playlist="playlist.id" @updatePlaylists="updatePlaylists" />
		</v-list-item>
		<v-dialog v-model="dialog" max-width="300">
			<v-card>
				<v-card-title class="headline">Select a device</v-card-title>
				<v-card-actions>
					<v-btn-toggle borderless class="d-flex flex-column">
						<v-btn
							v-for="device in devices"
							:key="device.key"
							:value="device.id"
							text
							block
							class="plain-btn justify-start"
							@click="play(device.id)"
						>
							<v-icon class="mr-2">{{getIcon(device.type)}}</v-icon>
							<span>{{device.name}}</span>
						</v-btn>
					</v-btn-toggle>
				</v-card-actions>
				<v-row class="d-flex flex-row-reverse px-4">
					<v-btn icon @click="refreshDevices">
						<v-icon>mdi-refresh</v-icon>
					</v-btn>
				</v-row>
			</v-card>
		</v-dialog>
	</v-row>
</template>

<script>
import DeletePlaylist from "../specialized/DeletePlaylist";

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
		getIcon(type) {
			return type === "Computer" ? "mdi-laptop" : "mdi-cellphone";
		},
		refreshDevices() {
			this.$emit("updateUserInfo");
		},
		play(deviceID) {
			this.$emit("updatePlayState", {
				state: "play",
				content: "spotify:playlist:" + this.playlist.id,
				device: deviceID
			});
			this.active = true;
			this.dialog = false;
		},
		updatePlaylists() {
			this.$emit("updatePlaylists");
		},
		getPlaylistInfo(playlist) {
			return this.nowPlaying === playlist.id
				? "Now playing..."
				: playlist.metadata.tracks +
						" Tracks, " +
						playlist.metadata.duration;
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