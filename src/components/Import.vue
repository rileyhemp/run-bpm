<template>
	<v-container>
		<v-row class="mx-1" dense>
			<v-col v-for="playlist in this.$attrs.playlists.items" :key="playlist.id" cols="4">
				<v-card flat tile>
					<v-img
						:src="playlist.images[0].url"
						:lazy-src="playlist.images[2].url"
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
		</v-row>
	</v-container>
</template>

<script>
export default {
	name: "Import"
};
// <v-card>
// 	<v-img
// 		src="https://i0.wp.com/themusicalhype.com/wp-content/uploads/2018/03/xxxtentacion-question-bad-vibes-forever.jpg"
// 	/>
// </v-card>
</script>

