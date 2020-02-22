<template>
	<div class="dashboard-wrapper">
		<add-button />
		<v-subheader>My Playlists</v-subheader>
		<saved-playlists v-bind="$attrs" @updateUserInfo="updateUserInfo" @play="play($event)" />
		<player />
	</div>
</template>

<script>
import AddNewButtonVue from "../specialized/AddNewButton.vue";
import SavedPlaylists from "../containers/SavedPlaylists";

export default {
	components: {
		"add-button": AddNewButtonVue,
		"saved-playlists": SavedPlaylists
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
</style>