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
		<v-row class="d-flex align-center mx-1 mt-2">
			<v-text-field v-model="query" class="mx-2" append-icon="mdi-magnify" @keydown="handleKeydown" @click:append="doSearch">
				<template v-slot:label>Search playlists</template>
			</v-text-field>
		</v-row>
		<p class="body-1 mx-2" v-if="searchResults.length > 0">More playlists</p>
		<v-row class="mx-1 mt-3" dense v-if="searchResults.length > 0">
			<playlist-card
				v-for="playlist in searchResults"
				:key="playlist.id"
				:playlist="playlist"
				:selected="selected"
				@selected="selectPlaylist(playlist.id)"
			/>
		</v-row>
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
			selected: [],
			query: null,
			searchResults: []
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
		},
		handleKeydown(event) {
			event.key === "Enter" ? this.doSearch() : null;
		},
		doSearch() {
			if (this.query.length > 0) {
				this.$http
					.get(`http://192.168.1.215:3000/search-playlists`, {
						params: {
							q: this.query,
							credentials: localStorage.RunBPM
						}
					})
					.then(res => {
						this.searchResults = res.data.body.playlists.items;
					})
					.catch(err => console.log(err));
			}
		}
	},
	mounted: function() {
		this.$emit("updateUserInfo");
	}
};
//
</script>
