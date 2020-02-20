<template>
	<v-list two-line v-if="$attrs.savedPlaylists.length">
		<v-list-item v-for="playlist in $attrs.savedPlaylists" :key="playlist.key">
			<v-list-item-content>
				<v-list-item-title>{{playlist.metadata.name}}</v-list-item-title>
				<v-list-item-subtitle>{{playlist.metadata.tracks}} Tracks, {{playlist.metadata.lowBPM}}–{{playlist.metadata.highBPM}}bpm</v-list-item-subtitle>
			</v-list-item-content>
			<v-spacer />
			<v-btn icon>
				<v-icon>mdi-pencil</v-icon>
			</v-btn>
		</v-list-item>
	</v-list>
</template>

<script>
export default {
	components: {}
};
</script>