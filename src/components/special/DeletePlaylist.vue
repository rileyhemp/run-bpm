<template>
	<v-dialog v-model="dialog" persistent max-width="290">
		<template v-slot:activator="{ on }">
			<v-btn icon v-on="on">
				<v-icon>mdi-delete</v-icon>
			</v-btn>
		</template>
		<v-card v-if="!loading">
			<v-card-title class="headline">Are you sure?</v-card-title>
			<v-card-text>This action cannot be undone</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="green darken-1" text @click="dialog = false">Back</v-btn>
				<v-btn color="green darken-1" text @click="deletePlaylist">Delete</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	props: ["playlist"],
	data() {
		return {
			dialog: false,
			loading: false
		};
	},
	methods: {
		deletePlaylist() {
			this.loading = true;
			this.$http
				.delete(`http://localhost:3000/playlists?id=${this.playlist}`)
				.then(() => {
					this.$emit("updatePlaylists");
					this.dialog = false;
				})
				.catch(err => console.log(err));
		}
	}
};
</script>