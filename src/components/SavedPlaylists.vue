<template>
	<v-list two-line>
		<v-list-item v-for="playlist in $attrs.playlists" :key="playlist.key">
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
export default {
	components: {}
};
</script>