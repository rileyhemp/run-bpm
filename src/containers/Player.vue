<template>
	<div class="player">
		<player-display v-bind="$attrs" />
		<player-controls v-bind="$attrs" @updatePlayState="updatePlayState" />
	</div>
</template>

<script>
import PlayerDisplay from "../components/PlayerDisplay";
import PlayerControls from "../components/PlayerControls";
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
