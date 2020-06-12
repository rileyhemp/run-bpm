<template>
	<v-app>
		<router-view class="pb-8" />
		<v-footer absolute class="body-2 py-4 mt-4"
			>© 2020
			<a href="https://rileyhemphill.dev" target="_blank" class="ml-1" style="color:white; cursor: pointer; text-decoration: none"
				>Riley Hemphill</a
			>
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
