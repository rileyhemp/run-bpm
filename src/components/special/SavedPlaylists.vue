<template>
	<div>
		<v-list two-line v-if="!$attrs.savedPlaylists.length">
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
				<v-dialog v-model="dialog" persistent max-width="290">
					<template v-slot:activator="{ on }">
						<v-btn icon v-on="on">
							<v-icon>mdi-delete</v-icon>
						</v-btn>
					</template>
					<v-card>
						<v-card-title class="headline">Are you sure?</v-card-title>
						<v-card-text>This action cannot be undone</v-card-text>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn color="green darken-1" text @click="dialog = false">Back</v-btn>
							<v-btn color="green darken-1" text @click="dialog = false">Delete</v-btn>
						</v-card-actions>
					</v-card>
				</v-dialog>
			</v-list-item>
		</v-list>
	</div>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			dialog: false
		};
	}
};
</script>