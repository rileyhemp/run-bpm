<template>
	<div class="player">
		<player-display v-bind="$attrs" />
		<player-controls v-bind="$attrs" @updatePlayState="updatePlayState" />
	</div>
</template>

<script>
import PlayerDisplay from "../specialized/PlayerDisplay";
import PlayerControls from "../specialized/PlayerControls";
export default {
	components: {
		"player-display": PlayerDisplay,
		"player-controls": PlayerControls
	},
	methods: {
		updatePlayState(event) {
			console.log(event);
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