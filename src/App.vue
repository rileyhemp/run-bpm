<template>
	<v-app>
		<router-view />
		<v-footer absolute class="body-2 py-4"
			>©2020 Run BPM<v-spacer /> Created by
			<a href="https://rileyhemphill.dev" target="_blank" class="ml-1">Riley Hemphill</a>
		</v-footer>
	</v-app>
</template>

<script>
export default {
	name: "App",
	data: () => ({
		//
	}),
};
</script>
