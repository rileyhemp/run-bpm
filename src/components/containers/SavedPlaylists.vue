<template>
	<div class="full-width">
		<v-list two-line v-if="!$attrs.savedPlaylists.length && !isSession">
			<v-list-item>
				<v-list-item-content>
					<v-list-item-title>Nothing here yet...</v-list-item-title>
					<v-list-item-subtitle>Tap the plus to get started</v-list-item-subtitle>
				</v-list-item-content>
			</v-list-item>
		</v-list>

		<v-list two-line v-if="$attrs.savedPlaylists.length">
			<v-list-item v-for="playlist in $attrs.savedPlaylists" :key="playlist.key">
				<launch-playlist
					v-bind="$attrs"
					@updateUserInfo="updateUserInfo"
					@play="play(playlist.id, $event)"
					@pause="pause"
				/>
				<v-list-item-content class="full-width">
					<v-list-item-title>{{playlist.metadata.name}}</v-list-item-title>
					<v-list-item-subtitle>{{playlist.metadata.tracks}} Tracks, {{playlist.metadata.lowBPM}}–{{playlist.metadata.highBPM}}bpm</v-list-item-subtitle>
				</v-list-item-content>
				<!-- <v-spacer /> -->
				<delete-playlist :playlist="playlist.id" @updatePlaylists="updatePlaylists" />
			</v-list-item>
		</v-list>
	</div>
</template>

<script>
import DeletePlaylist from "../specialized/DeletePlaylist";
import LaunchPlaylist from "../specialized/LaunchPlaylist";
export default {
	components: {
		"delete-playlist": DeletePlaylist,
		"launch-playlist": LaunchPlaylist
	},
	methods: {
		updatePlaylists() {
			this.$emit("updatePlaylists");
		},
		updateUserInfo() {
			this.$emit("updateUserInfo");
		},
		play(playlistID, deviceID) {
			this.$emit("play", { playlistID: playlistID, deviceID: deviceID });
		},
		pause() {
			this.$emit("pause");
		}
	}
};
</script>

<style scoped>
.full-width {
	flex: 1 1 100%;
}
</style>