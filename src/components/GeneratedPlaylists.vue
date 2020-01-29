<template>
	<v-list two-line>
		<add-button />
		<v-subheader>My Playlists</v-subheader>
		<v-list-item>
			<v-list-item-content>
				<v-list-item-title>Title</v-list-item-title>
				<v-list-item-subtitle>Description</v-list-item-subtitle>
			</v-list-item-content>
			<v-spacer />
			<v-btn icon>
				<v-icon>mdi-pencil</v-icon>
			</v-btn>
		</v-list-item>
	</v-list>
</template>

<script>
import AddNewButtonVue from "./AddNewButton.vue";

export default {
	components: {
		"add-button": AddNewButtonVue
	}
};
</script>