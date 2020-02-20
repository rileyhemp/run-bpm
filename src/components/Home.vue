<template>
	<div class="dashboard-wrapper">
		<add-button />
		<v-subheader>My Playlists</v-subheader>
		<saved-playlists v-bind="$attrs" />
	</div>
</template>

<script>
import AddNewButtonVue from "./AddNewButton.vue";
import SavedPlaylists from "./SavedPlaylists";

export default {
	components: {
		"add-button": AddNewButtonVue,
		"saved-playlists": SavedPlaylists
	}
};
</script>

<style scoped>
.v-subheader {
	margin: 8px 0 -24px 0;
}
</style>