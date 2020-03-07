<template>
	<div class="user-avatar">
		<v-menu v-model="showMenu" :nudge-bottom="56">
			<v-list class="text-right">
				<v-list-item>
					<v-list-item-title>Connected as {{ this.$attrs.user.display_name }}</v-list-item-title>
				</v-list-item>
				<v-list-item @click="openSpotifyProfile">
					<v-list-item-title>View on Spotify</v-list-item-title>
				</v-list-item>
				<v-list-item>
					<v-list-item-title>Logout</v-list-item-title>
				</v-list-item>
			</v-list>
		</v-menu>
		<v-btn icon @click="showMenu = !showMenu">
			<v-avatar v-if="this.$attrs.user" color="primary" size="42px">
				<span v-if="!this.hasAvatar" style="color:white">{{ getInitials(this.$attrs.user.display_name) }}</span>
				<img v-if="this.hasAvatar" :src="this.hasAvatar ? this.$attrs.user.images[0].url : null" />
			</v-avatar>
		</v-btn>
	</div>
</template>

<script>
export default {
	data: function() {
		return {
			showMenu: false
		};
	},
	methods: {
		getInitials(displayName) {
			if (displayName) {
				const names = displayName.split(" ");
				let initials = names[0].substring(0, 1).toUpperCase();
				if (names.length > 1) {
					initials += names[names.length - 1].substring(0, 1).toUpperCase();
				}
				return initials;
			}
		},
		openSpotifyProfile() {
			window.open(this.$attrs.user.external_urls.spotify);
		}
	},
	computed: {
		hasAvatar: function() {
			if (this.$attrs.user.images) {
				if (this.$attrs.user.images[0].height) {
					return true;
				}
				return false;
			}
			return false;
		}
	}
};
</script>

<style>
.v-menu__content {
	left: unset !important;
	right: 0px;
}
</style>
