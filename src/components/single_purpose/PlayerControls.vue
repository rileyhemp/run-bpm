<template>
	<div class="player-controls">
		<v-btn
			@click="previous"
			:height="48"
			:width="48"
			:disabled="$attrs.currentTrack.duration === undefined"
			class="player-ctrl always-transparent mx-2"
			:class="$attrs.disableButtons ? 'pointer-events-none' : null"
			icon
			outlined
		>
			<v-icon medium>mdi-skip-previous</v-icon>
		</v-btn>
		<v-btn
			@click="togglePlay"
			:height="60"
			:width="60"
			:disabled="$attrs.currentTrack.duration === undefined"
			class="player-ctrl play-button mx-2"
			:class="$attrs.disableButtons ? 'pointer-events-none' : null"
			icon
			outlined
		>
			<v-icon large>{{$attrs.currentTrack.isPlaying ? 'mdi-pause' : 'mdi-play'}}</v-icon>
		</v-btn>
		<v-btn
			@click="next"
			:height="48"
			:width="48"
			:disabled="$attrs.currentTrack.duration === undefined"
			class="player-ctrl always-transparent mx-2"
			:class="$attrs.disableButtons || !$attrs.currentTrack.id ? 'pointer-events-none' : null"
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

		songTitle: function() {
			return this.nowPlaying.item ? this.nowPlaying.item.name : null;
		}
	},
	methods: {
		togglePlay() {
			this.$attrs.currentTrack.isPlaying ? this.pause() : this.play();
		},
		play() {
			this.$attrs.currentTrack.isPlaying = true;
			this.$emit("updatePlayState", { state: "play" });
		},
		pause() {
			this.$attrs.currentTrack.isPlaying = false;
			this.$emit("updatePlayState", { state: "pause" });
		},
		previous() {
			this.$emit("updatePlayState", { state: "previous" });
		},
		next() {
			this.$emit("updatePlayState", { state: "next" });
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
.pointer-events-none {
	pointer-events: none;
}
</style>