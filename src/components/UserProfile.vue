<template>
	<v-avatar color="primary" size="36px">
		<span v-if="!isAvatar()">RH</span>
		<img v-if="isAvatar()" :src="$attrs.images[0]" />
	</v-avatar>
</template>

<script>
export default {
	methods: {
		isAvatar() {
			this.$attrs.images ? true : false;
		}
	}
};
</script>