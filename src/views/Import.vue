<template>
	<v-container>
		<v-row class="ma-1">
			<v-btn text @click="$router.push('/')">Back</v-btn>
			<v-spacer />
			<v-btn color="primary" :disabled="isDisabled" :to="{ name: 'Create', params: { playlists: this.selected } }">Continue</v-btn>
		</v-row>
		<v-row class="mt-6 mb-2 mx-2">
			<p class="subtitle-1">Step 1 / 2</p>
			<v-spacer />
			<p class="subtitle-1">Select one or more playlists</p>
		</v-row>
		<p class="body-1 ma-2">Your playlists</p>
		<v-row class="mx-1 mt-3" dense>
			<playlist-card
				v-for="playlist in this.$attrs.userPlaylists.items"
				:key="playlist.id"
				:playlist="playlist"
				:selected="selected"
				@click.native="selectPlaylist(playlist.id)"
			/>
		</v-row>
		<p class="body-1 ma-2">Search</p>
	</v-container>
</template>

<script>
import PlaylistCardVue from "../components/PlaylistCard.vue";
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
