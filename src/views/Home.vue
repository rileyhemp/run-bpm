<template>
	<div class="dashboard-wrapper">
		<v-subheader>My Playlists</v-subheader>
		<created-playlists
			v-bind="$attrs"
			:key="$attrs.CreatedPlaylists.length"
			@updateUserInfo="updateUserInfo"
			@updatePlaylists="updatePlaylists"
			@updatePlayState="updatePlayState"
		/>
		<add-button />
		<v-spacer />
	</div>
</template>

<script>
import AddNewButtonVue from "../components/AddNewButton.vue";
import CreatedPlaylists from "../containers/CreatedPlaylists";

export default {
	components: {
		"add-button": AddNewButtonVue,
		"created-playlists": CreatedPlaylists
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
		updatePlaylists() {
			this.$emit("updatePlaylists");
		},
		play(event) {
			this.paused = false;
			this.playing = event;
			document.querySelector(".play-button").click();
		},
		pause() {
			this.paused = true;
		}
	},
	mounted: function() {
		console.log(this.$vuetify.breakpoint);
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
