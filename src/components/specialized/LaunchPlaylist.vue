<template>
	<v-dialog v-model="dialog" persistent max-width="290">
		<template v-slot:activator="{ on }">
			<v-btn icon outlined class="mr-2" v-on="on">
				<v-icon>mdi-play</v-icon>
			</v-btn>
		</template>
		<v-card>
			<v-card-title class="headline">Select your device</v-card-title>
			<!-- <v-card-text>This action cannot be undone</v-card-text> -->
			<v-card-actions>
				<v-btn-toggle borderless>
					<v-btn value="device1" text block class="plain-btn justify-start">
						<v-icon class="mr-2">mdi-cellphone-android</v-icon>
						<span>Device 1</span>
					</v-btn>
				</v-btn-toggle>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	data: function() {
		return {
			dialog: false
		};
	}
};
</script>

<style scoped>
.v-btn-toggle {
	flex-direction: column;
	flex: 1;
}
.justify-start {
	justify-content: start;
}
.plain-btn:hover:before {
	background-color: transparent;
}
</style>