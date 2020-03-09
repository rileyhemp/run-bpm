<template>
	<v-col cols="4">
		<v-dialog v-model="details" width="600px">
			<template v-slot:activator="{ on }">
				<v-card :elevation="12" flat tile :outlined="isSelected" @click.native="selectPlaylist" :focus="isSelected">
					<v-img
						:src="playlist.images[0].url"
						aspect-ratio="1"
						class="grey lighten-2 d-flex align-start"
						:alt="`Image of ${playlist.name}`"
					>
						<v-btn color="rgba(0,0,0,0.6)" v-on="on" fab small v-show="isSelected">
							<v-icon>mdi-format-list-numbered</v-icon>
						</v-btn>
						<template v-slot:placeholder>
							<v-row class="fill-height ma-0" align="center" justify="center">
								<v-progress-circular indeterminate color="grey lighten-5" />
							</v-row>
						</template>
					</v-img>
					<v-row align="end" dense>
						<v-col class="subtitle-2">{{ playlist.name }}</v-col>
					</v-row>
				</v-card>
			</template>
			<playlist-tracks :playlist="playlist" :tracks="tracks" @close="details = false" v-if="details" />
		</v-dialog>
	</v-col>
</template>

<script>
import PlaylistTracks from "./PlaylistTracks";
export default {
	name: "playlist-card",
	components: {
		"playlist-tracks": PlaylistTracks
	},
	props: ["playlist"],
	data: function() {
		return {
			details: false,
			isSelected: false,
			tracks: Array
		};
	},
	methods: {
		selectPlaylist() {
			this.$emit("selected");
			this.$http
				.get("http://localhost:3000/playlist-details", {
					params: {
						playlist: this.playlist.id,
						credentials: localStorage.RunBPM
					}
				})
				.then(res => {
					this.tracks = res.data;
					this.isSelected = !this.isSelected;
				})
				.catch(err => console.log(err));
		}
	}
};
</script>
