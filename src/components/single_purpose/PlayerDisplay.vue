<template>
	<div class="player-display" v-if="$attrs.currentTrack.audioFeatures">
		<div class="px-4 mb-2">
			<div class="d-flex justify-space-between align-end">
				<h2 class="song-title title">{{$attrs.currentTrack.id.item.name}}</h2>
				<span class="title nowrap">{{Math.round($attrs.currentTrack.audioFeatures.tempo) + "bpm"}}</span>
			</div>
			<div class="d-flex justify-space-between align-center">
				<strong class="song-artists subtitle-1">{{artist}}</strong>
				<span class="caption">{{counter}}</span>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data: function() {
		return {
			progress: null
		};
	},
	computed: {
		artist: function() {
			const artists = this.$attrs.currentTrack.id.item.artists;
			let names = [];
			if (artists.length > 1) {
				artists.forEach(el => {
					names.push(el.name);
				});
				return names.join(", ");
			}
			return artists[0].name;
		},
		counter: function() {
			let duration = this.msToMinAndSec(
				this.$attrs.currentTrack.id.item.duration_ms
			);
			// let elapsed = this.msToMinAndSec(this.progress);
			return duration;
			// return elapsed + "/" + duration;
		}
	},
	// mounted: function() {
	// 	setInterval(() => {
	// 		if (
	// 			this.$attrs.currentTrack.progress &&
	// 			typeof this.$attrs.currentTrack.progress === "number"
	// 		) {
	// 			this.progress = this.$attrs.currentTrack.progress;
	// 		}
	// 	}, 100);
	// },
	methods: {
		msToMinAndSec: function(ms) {
			let minutes = Math.floor(ms / 60000);
			let seconds = ((ms % 60000) / 1000).toFixed(0);
			return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
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