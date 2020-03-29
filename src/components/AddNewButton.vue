<template>
	<v-row class="mx-4 py-1" :class="$vuetify.breakpoint.mdAndUp ? 'mt-4' : null">
		<v-spacer v-if="!$vuetify.breakpoint.mdAndUp" />
		<v-btn fab color="primary" medium to="/import">
			<v-icon>mdi-plus</v-icon>
		</v-btn>
	</v-row>
</template>

<script>
export default {};
</script>
