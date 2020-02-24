<template>
	<div class="player" v-if="$attrs.currentTrack.audioFeatures">
		<player-display v-bind="$attrs" />
		<player-controls v-bind="$attrs" @updatePlayState="updatePlayState" />
	</div>
</template>

<script>
import PlayerDisplay from "../single_purpose/PlayerDisplay";
import PlayerControls from "../single_purpose/PlayerControls";
export default {
	components: {
		"player-display": PlayerDisplay,
		"player-controls": PlayerControls
	},
	methods: {
		updatePlayState(event) {
			this.$emit("updatePlayState", event);
		}
	}
};
</script>

<style scoped>
.player {
	position: fixed;
	bottom: 0;
	width: 100%;
}
</style>