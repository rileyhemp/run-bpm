<template>
	<div class="full-width">
		<v-list two-line v-if="!$attrs.CreatedPlaylists.length && !isSession">
			<v-list-item>
				<v-list-item-content>
					<v-list-item-title>Nothing here yet...</v-list-item-title>
					<v-list-item-subtitle>Tap the plus to get started</v-list-item-subtitle>
				</v-list-item-content>
			</v-list-item>
		</v-list>

		<v-list two-line v-if="$attrs.CreatedPlaylists.length">
			<playlist
				v-for="playlist in $attrs.CreatedPlaylists"
				:key="playlist.key"
				:playlist="playlist"
				@updatePlaylists="updatePlaylists"
				@updateUserInfo="updateUserInfo"
				@updatePlayState="updatePlayState"
				v-bind="$attrs"
			/>
		</v-list>
	</div>
</template>

<script>
import Playlist from "./Playlist";
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
		updatePlayState(event) {
			this.$emit("updatePlayState", event);
		}
	}
};
</script>

<style scoped>
.full-width {
	flex: 1 1 100%;
}
</style>