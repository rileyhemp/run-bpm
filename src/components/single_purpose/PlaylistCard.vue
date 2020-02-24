<template>
	<v-col cols="4">
		<v-card flat tile>
			<v-img
				:src="playlist.images[0].url"
				aspect-ratio="1"
				class="grey lighten-2 align-end"
				:alt="`Image of ${playlist.name}`"
			>
				<template v-slot:placeholder>
					<v-row class="fill-height ma-0" align="center" justify="center">
						<v-progress-circular indeterminate color="grey lighten-5" />
					</v-row>
				</template>
			</v-img>
			<v-row align="end" dense>
				<v-col class="subtitle-2">{{playlist.name}}</v-col>
			</v-row>
		</v-card>
	</v-col>
</template>

<script>
export default {
	name: "playlist-card",
	props: ["playlist"],
	methods: {
		selectPlaylist() {
			console.log("asd");
		}
	}
};
</script>