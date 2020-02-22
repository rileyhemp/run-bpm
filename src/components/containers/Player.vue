<template>
	<div class="player px-4">
		<v-btn :height="48" :width="48" class="player-ctrl always-transparent mx-2" icon outlined>
			<v-icon medium>mdi-skip-previous</v-icon>
		</v-btn>
		<v-btn :height="48" :width="48" class="player-ctrl always-transparent mx-2" icon outlined>
			<v-icon medium>mdi-stop</v-icon>
		</v-btn>
		<v-btn-toggle class="pause-play-group">
			<v-btn :height="60" :width="60" class="player-ctrl mx-2" icon :ripple="false">
				<v-icon large>mdi-play</v-icon>
			</v-btn>
			<v-btn :height="48" :width="48" class="player-ctrl mx-2" icon :ripple="false">
				<v-icon medium>mdi-pause</v-icon>
			</v-btn>
		</v-btn-toggle>
		<v-btn :height="48" :width="48" class="player-ctrl always-transparent mx-2" icon outlined>
			<v-icon medium>mdi-skip-next</v-icon>
		</v-btn>
	</div>
</template>

<script>
export default {};
</script>

<style scoped>
.player {
	position: fixed;
	bottom: 0;
	height: 80px;
	border-top: 1px solid black;
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