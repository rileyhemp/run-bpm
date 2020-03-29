// eslint-disable-file
<template>
	<v-container fluid>
		<v-row>
			<v-btn text class="ml-4" @click="() => this.$router.push('Create')">Back</v-btn>
		</v-row>
		<v-row class="mt-6 px-4">
			<p class="subtitle-1">Step 3 / 3</p>
			<v-spacer />
			<p class="subtitle-1">Review and save</p>
		</v-row>
		<v-row class="px-4 ">
			<span class="subtitle-1">What would you like to do?</span>
			<v-btn
				class="my-2"
				:color="createNewPlaylist ? 'primary' : 'default'"
				@click="
					createNewPlaylist = true;
					addToPlaylist = false;
				"
				block
				>Create a new playlist</v-btn
			>
			<v-btn
				class="my-2"
				:color="addToPlaylist ? 'primary' : 'default'"
				@click="
					addToPlaylist = true;
					createNewPlaylist = false;
				"
				block
				>Add to an existing playlist</v-btn
			>
		</v-row>
		<v-row v-if="createNewPlaylist" class="px-4 pb-8 pt-4">
			<v-text-field autofocus label="Enter a name" hide-details="auto" v-model="playlistName" />
		</v-row>
		<v-row class="px-4" v-if="createNewPlaylist"
			><v-btn
				color="primary"
				class="mr-2"
				@click="
					() => {
						this.createPlaylistFromSelection().then(() => this.$router.push('/'));
					}
				"
				block
				>Create</v-btn
			>
		</v-row>
		<v-row v-if="addToPlaylist" class="px-4 pb-8 pt-4" dense>
			<playlist-card
				v-for="playlist in this.$attrs.userPlaylists.items"
				:key="playlist.id"
				:playlist="playlist"
				:selected="selected"
				@click.native="confirm ? null : selectPlaylist(playlist)"
				:selectable="true"
			/>
		</v-row>
		<v-row>
			<v-dialog v-model="confirm" width="300">
				<v-card v-if="!loading" class="pb-8">
					<v-row class="px-4 mt-1">
						<v-spacer />
						<v-btn icon @click="closeModal"><v-icon>mdi-close</v-icon></v-btn>
					</v-row>
					<v-card-title class="subtitle-1 no-word-break">
						Add {{ playlistMetadata.tracks }} tracks to {{ playlistToUpdate.name }}?
					</v-card-title>
					<v-row class="px-8 mt-2">
						<v-btn
							block
							class="mx-auto px-4"
							color="primary"
							@click="
								() => {
									this.addToExistingPlaylist().then(() => console.log('done'));
								}
							"
							>Okay</v-btn
						>
					</v-row>
				</v-card>
			</v-dialog>
		</v-row>
	</v-container>
</template>

<script>
import getIDsFromDetails from "@/scripts/getIDsFromDetails";
import PlaylistCardVue from "../components/PlaylistCard.vue";

export default {
	name: "save-playlist",
	components: {
		"playlist-card": PlaylistCardVue
	},
	data: function() {
		return {
			loading: false,
			selected: [],
			bars: true,
			chartData: Object,
			chartsReady: false,
			renderKey: 1,
			playlistName: undefined,
			createNewPlaylist: false,
			addToPlaylist: true,
			finishedWithSelection: false,
			showMoreFilters: false,
			confirm: false,
			mountFilters: false,
			reviewCategory: null,
			playlistTracks: Object,
			playlistMetadata: Object,
			playlistToUpdate: Object
		};
	},
	methods: {
		selectPlaylist(playlist) {
			this.confirm = true;
			this.playlistToUpdate = playlist;
		},
		closeModal() {
			this.confirm = false;
			this.createNewPlaylist = false;
		},
		addToExistingPlaylist() {
			return new Promise((resolve, reject) => {
				const trackIDs = getIDsFromDetails(this.playlistTracks);
				this.$http
					.put("http://192.168.1.215:3000/playlists", {
						data: {
							trackIDs: trackIDs,
							targetPlaylist: this.playlistToUpdate
						}
					})
					.then(() => resolve())
					.catch(err => reject(err));
			});
		},
		createPlaylistFromSelection() {
			return new Promise((resolve, reject) => {
				//Add playlist name to metadata
				this.playlistMetadata.name = this.playlistName;
				const metadata = JSON.stringify(this.playlistMetadata);
				//Get array of selected track's IDs.
				const trackIDs = getIDsFromDetails(this.playlistTracks);
				console.log(trackIDs);
				this.$emit("loading");
				// Create the playlist
				this.$http
					.post("http://192.168.1.215:3000/playlists", {
						data: {
							userID: this.$attrs.user.id,
							trackIDs: trackIDs,
							metadata: metadata,
							name: this.playlistName,
							credentials: localStorage.RunBPM
						}
					})
					.then(res => {
						console.log(res);
						this.updateUserInfo();
						//Check to see if user info has updated before resolving promise
						let i = setInterval(() => {
							if (!this.$attrs.loading) {
								clearInterval(i);
								resolve();
							}
						}, 20);
					})
					.catch(err => {
						console.log("Something went wrong", err);
						this.loading = false;
						reject();
					});
			});
		},
		updateUserInfo() {
			this.$emit("updateUserInfo");
		},
		saveAndReset() {
			//Reset the selection, slider range, and chart
			this.createPlaylistFromSelection().then(() => {
				this.playlistName = undefined;
				Object.keys(this.filters).forEach(i => {
					this.filters[i].range = this.filters[i].defaultRange;
				});
				setTimeout(() => this.filterChartData(), 150);
			});
		},
		convertToDoubletime() {
			//Double tempo for tracks under 100bpm (90bpm ~= 180bpm)
			this.audioFeatures.forEach(track => {
				track.features.tempo = Math.round(track.features.tempo);
				track.features.tempo < 100
					? (track.features.doubletime = track.features.tempo * 2)
					: (track.features.doubletime = track.features.tempo);
			});
			this.mountFilters = true;
		},
		initChartData() {
			const filters = Object.keys(this.filters);
			//Loop through each filter
			filters.forEach(el => {
				const filter = this.filters[el];
				let multiplier;
				if (el === "doubletime") {
					multiplier = 1;
				} else {
					multiplier = 100;
				}
				const segments = [];
				//Group tracks into segments
				for (let i = filter.defaultRange[0]; i < filter.defaultRange[1]; i = i + filter.segmentSize) {
					let segment = {};
					let tracks = 0;
					//Count how many tracks are in each segment
					this.selectedTracks.forEach(track => {
						track.features[el] * multiplier >= i && track.features[el] * multiplier < i + filter.segmentSize ? tracks++ : null;
					});
					//Axis name
					segment.axis = i + 1;
					//Percentage of total tracks in segment
					segment.value = tracks / this.selectedTracks.length;
					if ((segment.axis = 1 & (segment.value > 0.2))) {
						segment.value = 0.2;
					}
					segment.valueSave = tracks / this.selectedTracks.length;
					//Number of tracks in segment
					segment.tracks = tracks;
					segments.push(segment);
				}
				this.chartData = { ...this.chartData, ...{ [el]: segments } };
				this.chartsReady = true;
				this.renderKey++;
			});
		},
		updateFilters: function(options) {
			this.$set(this.filters[options.filter], "range", options.range);
		},
		// prettier-ignore
		handleChartClick() {
			console.log(event.toElement.style.fill);
			document.querySelector(".review-circle").style.backgroundColor = event.toElement.style.fill;
			event.toElement.style.fill === "rgb(214, 39, 40)"
				? (this.reviewCategory = `BPM: ${this.lowBPM} - ${this.highBPM}`)
				: event.toElement.style.fill === "rgb(44, 160, 44)"
					? (this.reviewCategory = `Energy: ${this.filters.energy.range[0]} - ${this.filters.energy.range[1]}`)
					: event.toElement.style.fill === "rgb(255, 127, 14)"
						? (this.reviewCategory = `Danceability: ${this.filters.danceability.range[0]} - ${this.filters.danceability.range[1]}`)
						: event.toElement.style.fill === "rgb(31, 119, 180)"
							? (this.reviewCategory = `Valence: ${this.filters.valence.range[0]} - ${this.filters.valence.range[1]}`)
							: null;
		}
	},
	mounted: function() {
		this.playlistMetadata = JSON.parse(localStorage.playlistMetadata);
		this.playlistTracks = JSON.parse(localStorage.playlistTracks);
	}
};
</script>

<style scoped></style>
