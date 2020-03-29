<template>
	<v-col :cols="$vuetify.breakpoint.mdAndUp ? 3 : 4">
		<v-card :elevation="12" class="card-select " :tile="!isSelected" :light="isSelected" @click.native="selectPlaylist" :focus="isSelected">
			<v-img :src="playlist.images[0].url" aspect-ratio="1" class="grey lighten-2 d-flex align-start" :alt="`Image of ${playlist.name}`">
			</v-img>
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
			isSelected: false
		};
	},
	methods: {
		selectPlaylist() {
			if (!this.selectable) {
				this.$emit("selected");
				this.isSelected = !this.isSelected;
			}
		}
	}
};
</script>
<style>
.card-select {
	border-color: #cf6679 !important;
}
</style>
