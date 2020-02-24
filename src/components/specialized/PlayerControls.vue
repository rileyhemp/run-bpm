<template>
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
			@click="togglePlay"
			:height="60"
			:width="60"
			class="player-ctrl play-button mx-2"
			icon
			outlined
		>
			<v-icon large>{{$attrs.currentTrack.isPlaying ? 'mdi-pause' : 'mdi-play'}}</v-icon>
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
</template>

<script>
export default {
	computed: {
		options: function() {
			if (this.playing) {
				return {
					device_id: this.playing.deviceID,
					context_uri: "spotify:playlist:" + this.playing.playlistID
				};
			}
			return null;
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
	// watch: {
	// 	options: function() {
	// 		if (this.options && !this.paused) {
	// 			this.play();
	// 		}
	// 	},
	// 	paused: function() {
	// 		if (this.options && this.paused) {
	// 			this.pause();
	// 		}
	// 	}
	// },
	methods: {
		togglePlay() {
			this.$attrs.playing ? this.pause() : this.play();
			this.$attrs.playing = !this.playing;
		},
		play() {
			this.$emit("updatePlayState", { state: "play" });
		},
		pause() {
			this.$emit("updatePlayState", { state: "pause" });
		},
		previous() {
			this.$emit("updatePlayState", "previous");
		},
		next() {
			this.$emit("updatePlayState", "next");
		}
	}
};
</script>

<style scoped>
.player-controls {
	border-top: 1px solid rgba(0, 0, 0, 0.3);
	align-items: center;
	justify-content: center;
	align-items: center;
	display: flex;
	width: 100%;
	height: 80px;
}
.v-btn:before {
	background-color: transparent;
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
</style>