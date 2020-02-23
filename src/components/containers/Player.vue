<template>
	<div class="player">
		<div class="px-4 mb-2">
			<h2 class="song-title subtitle-1">{{songTitle}}</h2>
			<div class="d-flex justify-between align-center">
				<strong class="song-artists subtitle-2" @click="getCurrentTrack">-{{artist}}</strong>
				<span class="caption">{{timeElapsed}}</span>
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
			if (this.nowPlaying.item) {
				total = millisToMinutesAndSeconds(
					this.nowPlaying.item.duration_ms
				);
				elapsed = millisToMinutesAndSeconds(
					this.nowPlaying.progress_ms
				);
			}
			return elapsed + "/" + total;
			function millisToMinutesAndSeconds(millis) {
				var minutes = Math.floor(millis / 60000);
				var seconds = ((millis % 60000) / 1000).toFixed(0);
				return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
			}
		}
	},
	data: function() {
		return {
			nowPlaying: Object
		};
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
		stop() {
			this.$http.put("http://localhost:3000/player?action=stop", {
				data: this.options
			});
		},
		play() {
			this.$http
				.put("http://localhost:3000/player?action=play", {
					data: this.options
				})
				.then(() => this.getCurrentTrack());
		},
		pause() {
			this.$http.put("http://localhost:3000/player?action=pause", {
				data: this.options
			});
		},
		next() {
			this.$http
				.put("http://localhost:3000/player?action=next", {
					data: this.options
				})
				.then(() => this.getCurrentTrack());
		},
		getCurrentTrack() {
			console.log("working");
			this.$http
				.get("http://localhost:3000/player?q=current")
				.then(response => {
					this.nowPlaying = response.data;
				})
				.catch(err => console.log(err));
		}
	},
	mounted: function() {}
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
	width: 60%;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
</style>