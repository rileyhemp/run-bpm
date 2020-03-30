<template>
	<v-dialog v-model="dialog" persistent max-width="290">
		<template v-slot:activator="{ on }">
			<v-btn icon v-on="on">
				<v-icon color="grey lighten-1">mdi-delete</v-icon>
			</v-btn>
		</template>
		<v-card>
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
			dialog: false
		};
	},
	methods: {
		deletePlaylist() {
			this.$http
				.delete(`https://d2ob92q3jfbd5e.cloudfront.net/playlists?id=${this.playlist}&credentials=${localStorage.RunBPM}`)
				.then(() => {
					this.$emit("updatePlaylists");
					this.dialog = false;
				})
				.catch(err => console.log(err));
		}
	}
};
</script>
