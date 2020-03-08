<template>
	<v-container>
		<v-row class="ma-1">
			<v-btn text @click="$router.push('dashboard')">Back</v-btn>
			<v-spacer />
			<v-btn color="primary" :disabled="isDisabled" :to="{ name: 'Create', params: { playlists: this.selected } }">Continue</v-btn>
		</v-row>
		<v-row class="mx-1 mt-3" dense>
			<playlist-card
				v-for="playlist in this.$attrs.userPlaylists.items"
				:key="playlist.id"
				:playlist="playlist"
				@click.native="selectPlaylist(playlist.id)"
			/>
		</v-row>
	</v-container>
</template>

<script>
import PlaylistCardVue from "../single_purpose/PlaylistCard.vue";
export default {
	name: "Import",
	components: {
		"playlist-card": PlaylistCardVue
	},
	data: function() {
		return {
			selected: []
		};
	},
	computed: {
		isDisabled: function() {
			return this.selected.length > 0 ? false : true;
		}
	},
	methods: {
		selectPlaylist(playlist) {
			//If the playlist has already been selected, deselect it.
			this.selected.indexOf(playlist) != -1 ? this.selected.splice(this.selected.indexOf(playlist), 1) : this.selected.push(playlist);
			//Push list to $attrs so the 'create' component can access it
			this.$attrs.selected = this.selected;
		}
	}
};
//
</script>
