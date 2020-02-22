<template>
	<div class="dashboard-wrapper">
		<add-button />
		<v-subheader>My Playlists</v-subheader>
		<saved-playlists v-bind="$attrs" @updateUserInfo="updateUserInfo" @play="play($event)" />
		<v-spacer />
		<player :playing="playing" />
	</div>
</template>

<script>
import AddNewButtonVue from "../specialized/AddNewButton.vue";
import SavedPlaylists from "../containers/SavedPlaylists";
import Player from "../containers/Player";

export default {
	components: {
		"add-button": AddNewButtonVue,
		"saved-playlists": SavedPlaylists,
		player: Player
	},
	data: function() {
		return {
			playing: Object
		};
	},
	methods: {
		updateUserInfo() {
			this.$emit("updateUserInfo");
		},
		play(event) {
			this.playing = event;
		}
	}
};
</script>

<style scoped>
.v-subheader {
	margin: 8px 0 -24px 0;
}
.dashboard-wrapper {
	height: 100%;
}
</style>