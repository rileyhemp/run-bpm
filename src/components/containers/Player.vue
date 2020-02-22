<template>
	<div class="player px-4">
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
		<v-btn-toggle class="pause-play-group">
			<v-btn
				@click="stop"
				:height="48"
				:width="48"
				class="player-ctrl always-transparent mx-2"
				icon
				outlined
			>
				<v-icon medium>mdi-stop</v-icon>
			</v-btn>
			<v-btn
				@click="play"
				:height="60"
				:width="60"
				class="player-ctrl play-button mx-2"
				icon
				:ripple="false"
			>
				<v-icon large>mdi-play</v-icon>
			</v-btn>
			<v-btn @click="pause" :height="48" :width="48" class="player-ctrl mx-2" icon :ripple="false">
				<v-icon medium>mdi-pause</v-icon>
			</v-btn>
		</v-btn-toggle>
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
	props: ["playing", "paused"],
	computed: {
		options: function() {
			return {
				device_id: this.playing.deviceID,
				context_uri: "spotify:playlist:" + this.playing.playlistID
			};
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
			this.$http.put("http://localhost:3000/player?action=previous", {
				data: this.options
			});
		},
		stop() {
			this.$http.put("http://localhost:3000/player?action=stop", {
				data: this.options
			});
		},
		play() {
			this.$http.put("http://localhost:3000/player?action=play", {
				data: this.options
			});
		},
		pause() {
			this.$http.put("http://localhost:3000/player?action=pause", {
				data: this.options
			});
		},
		next() {
			this.$http.put("http://localhost:3000/player?action=next", {
				data: this.options
			});
		}
	}
};
</script>

<style scoped>
.player {
	position: fixed;
	bottom: 0;
	height: 80px;
	border-top: 1px solid rgba(0, 0, 0, 0.3);
	display: flex;
	width: 100%;
	align-items: center;
	justify-content: center;
	align-items: center;
}
.pause-play-group {
	display: flex;
	align-items: center;
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