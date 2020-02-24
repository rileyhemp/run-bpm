<template>
	<div class="player-display">
		<div class="px-4 mb-2">
			<div class="d-flex justify-space-between align-end">
				<h2 class="song-title title">Song title</h2>
				<span class="title nowrap">{{"tempo" + "bpm"}}</span>
			</div>
			<div class="d-flex justify-space-between align-center">
				<strong class="song-artists subtitle-1">Artist</strong>
				<span class="caption">now/total</span>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	methods: {
		millisToMinutesAndSeconds: function(millis) {
			let minutes = Math.floor(millis / 60000);
			let seconds = ((millis % 60000) / 1000).toFixed(0);
			return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
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
		}
	}
};
</script>

<style scoped>
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