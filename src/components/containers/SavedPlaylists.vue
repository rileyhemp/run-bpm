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
			<playlist
				v-for="playlist in $attrs.savedPlaylists"
				:key="playlist.key"
				:playlist="playlist"
				@updatePlaylists="updatePlaylists"
				v-bind="$attrs"
			/>
		</v-list>
	</div>
</template>

<script>
import Playlist from "../specialized/Playlist";
export default {
	components: {
		playlist: Playlist
	},
	data: function() {
		return {
			nowPlaying: null
		};
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
			this.nowPlaying = playlistID;
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