<template>
	<div class="dashboard-wrapper">
		<add-button />
		<v-subheader>My Playlists</v-subheader>
		<saved-playlists
			v-bind="$attrs"
			@updateUserInfo="updateUserInfo"
			@play="play($event)"
			@pause="pause"
		/>
		<v-spacer />
		<player :playing="playing" :paused="paused" />
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
			playing: Object,
			paused: false
		};
	},
	methods: {
		updateUserInfo() {
			this.$emit("updateUserInfo");
		},
		play(event) {
			this.paused = false;
			this.playing = event;
			document.querySelector(".play-button").click();
		},
		pause() {
			this.paused = true;
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