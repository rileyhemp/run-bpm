<template>
	<v-col cols="4">
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
	props: ["playlist"],
	data: function() {
		return {
			isSelected: false
		};
	},
	methods: {
		selectPlaylist() {
			this.$emit("selected");
			this.isSelected = !this.isSelected;
		}
	}
};

// if (this.tracks === null) {
// 	this.$http
// 		.get("http://192.168.1.215:3000/playlist-details", {
// 			params: {
// 				playlist: this.playlist.id,
// 				credentials: localStorage.RunBPM
// 			}
// 		})
// 		.then(res => {
// 			this.tracks = res.data;
// 			this.isSelected = !this.isSelected;
// 		})
// 		.catch(err => console.log(err));
// }
</script>
<style>
.card-select {
	border-color: #cf6679 !important;
}
</style>
