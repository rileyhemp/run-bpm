<template>
	<div class="player">
		<div class="px-4 mb-2">
			<div class="d-flex justify-space-between align-end">
				<h2 class="song-title title">{{songTitle}}</h2>
				<span
					v-if="nowPlaying.audio_features"
					class="title nowrap"
				>{{nowPlaying.audio_features ? Math.floor(nowPlaying.audio_features.tempo):null}} bpm</span>
			</div>
			<div class="d-flex justify-space-between align-center">
				<strong class="song-artists subtitle-1">{{artist}}</strong>
				<span v-show="isPlaying || isPaused" class="caption">{{timeElapsed}}</span>
			</div>
		</div>
		<div class="player-controls">
			<v-btn
				@click="previous"
				:height="48"
				:width="48"
				class="player-ctrl always-transparent mx-2"
				icon
				outlined
			>
				<v-icon medium>mdi-skip-previous</v-icon>
			</v-btn>
			<v-btn
				@click="play"
				:height="60"
				:width="60"
				class="player-ctrl play-button mx-2"
				icon
				:ripple="false"
				outlined
			>
				<v-icon large>mdi-play</v-icon>
			</v-btn>
			<v-btn
				@click="next"
				:height="48"
				:width="48"
				class="player-ctrl always-transparent mx-2"
				icon
				outlined
			>
				<v-icon medium>mdi-skip-next</v-icon>
			</v-btn>
		</div>
	</div>
</template>

<script>
export default {
	props: ["playing", "paused"],
	data: function() {
		return {
			nowPlaying: Object,
			progress: Number,
			isPaused: false,
			isPlaying: false
		};
	},
	computed: {
		options: function() {
			return {
				device_id: this.playing.deviceID,
				context_uri: "spotify:playlist:" + this.playing.playlistID
			};
		},
		artist: function() {
			if (this.nowPlaying.item) {
				const artists = this.nowPlaying.item.artists;
				let names = [];
				if (artists.length > 1) {
					console.log("got more data");
					artists.forEach(el => {
						names.push(el.name);
						console.log(names);
					});
					return names.join(", ");
				}
				return artists[0].name;
			}
			return null;
		},
		songTitle: function() {
			return this.nowPlaying.item ? this.nowPlaying.item.name : null;
		},
		timeElapsed: function() {
			let total, elapsed;
			if (
				this.nowPlaying.is_playing &&
				typeof this.progress === "number"
			) {
				total = this.millisToMinutesAndSeconds(
					this.nowPlaying.item.duration_ms
				);
				elapsed = this.millisToMinutesAndSeconds(this.progress);
			}
			return elapsed && total ? elapsed + "/" + total : null;
		}
	},
	watch: {
		options: function() {
			if (this.options && !this.paused) {
				this.play();
			}
		},
		paused: function() {
			if (this.options && this.paused) {
				this.pause();
			}
		}
	},
	methods: {
		previous() {
			this.$http
				.put("http://localhost:3000/player?action=previous", {
					data: this.options
				})
				.then(() => this.getCurrentTrack());
		},
		play() {
			this.$http
				.put("http://localhost:3000/player?action=play", {
					data: this.options
				})
				.then(() => this.getCurrentTrack());
		},
		pause() {
			console.log("I ran");
			this.$http
				.put("http://localhost:3000/player?action=pause", {
					data: this.options
				})
				.then(() => (this.isPaused = true));
		},
		next() {
			this.$http
				.put("http://localhost:3000/player?action=next", {
					data: this.options
				})
				.then(() => this.getCurrentTrack());
		},
		getCurrentTrack() {
			this.$http
				.get("http://localhost:3000/player?q=current")
				.then(response => {
					this.nowPlaying = response.data;
					if (response.data.item.id) {
						this.getTrackDetails(response.data.item.id);
					}
					if (response.data.is_playing) {
						this.initTimer(
							response.data.progress_ms,
							response.data.item.duration_ms
						);
					}
				})
				.catch(err => console.log(err));
		},
		getTrackDetails(id) {
			this.$http
				.get(`http://localhost:3000/analyze-tracks?id=${id}`)
				.then(response => {
					this.nowPlaying.audio_features = response.data;
				});
		},
		initTimer(progress, duration) {
			this.isPlaying = true;
			//Catch element for use in interval
			const self = this;
			//Not perfect, but due to latency progress needs to start back one second to match Spotify.
			progress = progress - 1000;

			let i = setInterval(() => {
				progress = progress + 1000;
				self.progress = progress;
				if (progress >= duration) {
					clearInterval(i);
					this.getCurrentTrack();
				}
			}, 1000);
		},
		millisToMinutesAndSeconds: function(millis) {
			let minutes = Math.floor(millis / 60000);
			let seconds = ((millis % 60000) / 1000).toFixed(0);
			return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
		}
	},
	mounted: function() {
		this.getCurrentTrack();
	}
};
</script>

<style scoped>
.player {
	position: fixed;
	bottom: 0;
	width: 100%;
}
.player-controls {
	border-top: 1px solid rgba(0, 0, 0, 0.3);
	align-items: center;
	justify-content: center;
	align-items: center;
	display: flex;
	width: 100%;
	height: 80px;
}
.player-ctrl {
	border-radius: 50px !important;
	padding: 0;
	min-width: 0 !important;
	border-color: rgba(0, 0, 0, 0.12) !important;
	color: black !important;
}
.always-transparent:before {
	background-color: rgba(0, 0, 0, 0);
}
.song-artists {
	width: 80%;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
.song-title {
	max-width: 75%;
}
.nowrap {
	white-space: nowrap;
}
</style>