<template>
	<div class="player px-4">
		<v-btn-toggle>
			<v-btn class="player-control" icon text>
				<v-icon>mdi-play</v-icon>
			</v-btn>
		</v-btn-toggle>
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
}

.player-control {
	border-radius: 50%;
}
</style>