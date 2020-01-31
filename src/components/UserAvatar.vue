<template>
	<v-btn icon class="mr-1">
		<v-avatar v-if="this.$attrs.user" color="primary" size="42px">
			<span v-if="!this.hasAvatar" style="color:white">{{getInitials(this.$attrs.user.display_name)}}</span>
			<img v-if="this.hasAvatar" :src="this.hasAvatar ? this.$attrs.user.images[0].url : null" />
		</v-avatar>
	</v-btn>
</template>

<script>
export default {
	data: function() {
		return {};
	},
	methods: {
		getInitials(displayName) {
			if (displayName) {
				const names = displayName.split(" ");
				let initials = names[0].substring(0, 1).toUpperCase();
				if (names.length > 1) {
					initials += names[names.length - 1]
						.substring(0, 1)
						.toUpperCase();
				}
				return initials;
			}
		}
	},
	computed: {
		hasAvatar: function() {
			return this.$attrs.user.images ? true : false;
		}
	}
};
</script>