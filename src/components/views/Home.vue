<template>
	<div class="dashboard-wrapper">
		<add-button />
		<v-subheader>My Playlists</v-subheader>
		<saved-playlists v-bind="$attrs" @updateUserInfo="updateUserInfo" />
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
	methods: {
		updateUserInfo() {
			this.$emit("updateUserInfo");
		}
	}
};
</script>

<style scoped>
.v-subheader {
	margin: 8px 0 -24px 0;
}
</style>