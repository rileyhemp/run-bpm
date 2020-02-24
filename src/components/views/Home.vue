<template>
	<div class="dashboard-wrapper">
		<add-button />
		<v-subheader>My Playlists</v-subheader>
		<saved-playlists
			v-bind="$attrs"
			@updateUserInfo="updateUserInfo"
			@updatePlayState="updatePlayState"
			@pause="pause"
		/>
		<v-spacer />
		<player v-bind="$attrs" @updateTrack="updateTrack" @updatePlayState="updatePlayState" />
	</div>
</template>

<script>
import AddNewButtonVue from "../single_purpose/AddNewButton.vue";
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
		updateTrack() {
			console.log("asd");
			this.$emit("updateTrack");
		},
		updatePlayState(event) {
			this.$emit("updatePlayState", event);
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