<template>
	<v-col :cols="$vuetify.breakpoint.xlOnly ? 2 : $vuetify.breakpoint.mdAndUp ? 3 : 4">
		<v-card
			:elevation="12"
			:class="$vuetify.breakpoint.lgAndUp ? 'pa-1 ma-1 card-select' : 'pa-1 card-select'"
			:tile="!isSelected"
			:light="isSelected"
			@click.native="selectPlaylist"
			:focus="isSelected"
		>
			<v-img
				v-if="playlist.images"
				:src="playlist.images[0].url"
				aspect-ratio="1"
				class="grey lighten-2 d-flex align-start"
				:alt="`Image of ${playlist.name}`"
			>
			</v-img>
			<v-sheet v-if="!playlist.images" class="placeholder">
				<v-icon size="70" color="grey">mdi-bookshelf</v-icon>
			</v-sheet>
			<v-row align="end" dense>
				<v-col class="subtitle-2 ml-1">{{ playlist.name }}</v-col>
			</v-row>
		</v-card>
	</v-col>
</template>

<script>
export default {
	name: "playlist-card",
	props: ["playlist", "selectable"],
	data: function() {
		return {
			isSelected: false,
		};
	},
	methods: {
		selectPlaylist() {
			if (!this.selectable) {
				this.$emit("selected");
				this.isSelected = !this.isSelected;
			}
		},
	},
};
</script>
<style>
.card-select {
	border-color: #cf6679 !important;
	height: 100%;
	display: flex;
	flex-direction: column;
}
.placeholder {
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
</style>
