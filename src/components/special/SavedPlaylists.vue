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
				<v-list-item-content>
					<v-list-item-title>{{playlist.metadata.name}}</v-list-item-title>
					<v-list-item-subtitle>{{playlist.metadata.tracks}} Tracks, {{playlist.metadata.lowBPM}}–{{playlist.metadata.highBPM}}bpm</v-list-item-subtitle>
				</v-list-item-content>
				<v-spacer />
				<delete-playlist :playlist="playlist.id" @updatePlaylists="updatePlaylists" />
			</v-list-item>
		</v-list>
	</div>
</template>

<script>
import DeletePlaylist from "./DeletePlaylist";
export default {
	props: ["isSession"],
	components: {
		"delete-playlist": DeletePlaylist
	},
	methods: {
		updatePlaylists() {
			this.$emit("updatePlaylists");
		}
	}
};
</script>

<style scoped>
.full-width {
	width: 100%;
}
</style>