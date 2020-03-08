<template>
	<v-app-bar flat>
		<v-toolbar-title>{{ pageTitle }}</v-toolbar-title>
		<v-spacer />
		<v-menu v-model="showMenu" :nudge-bottom="56">
			<v-list class="text-right">
				<v-list-item>
					<v-list-item-title>Connected as {{ this.$attrs.user.display_name }}</v-list-item-title>
				</v-list-item>
				<v-list-item @click="openSpotifyProfile">
					<v-list-item-title>View on Spotify</v-list-item-title>
				</v-list-item>
				<v-list-item @click="logout">
					<v-list-item-title>Logout</v-list-item-title>
				</v-list-item>
			</v-list>
		</v-menu>
		<user-avatar v-bind="$attrs" @toggleMenu="toggleMenu" />
	</v-app-bar>
</template>

<script>
import UserAvatar from "../single_purpose/UserAvatar";
export default {
	name: "Header",
	components: {
		"user-avatar": UserAvatar
	},
	props: ["pageTitle"],
	data: function() {
		return {
			showMenu: false
		};
	},
	methods: {
		toggleMenu() {
			this.showMenu = !this.showMenu;
		},
		openSpotifyProfile() {
			window.open(this.$attrs.user.external_urls.spotify);
		},
		logout() {
			localStorage.removeItem("RunBPM");
			this.$router.push("/connect");
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
