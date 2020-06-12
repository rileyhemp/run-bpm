<template>
	<v-app-bar class="main-header">
		<div class="header-content">
			<v-toolbar-title>{{ pageTitle }}</v-toolbar-title>
			<v-spacer />
			<v-menu v-model="showMenu" :nudge-bottom="56" style="z-index:1000">
				<v-list class="text-right">
					<v-list-item @click="openSpotifyProfile">
						<v-list-item-title>Connected as {{ this.$attrs.user.display_name }}</v-list-item-title>
					</v-list-item>
					<v-list-item @click="logout">
						<v-list-item-title>{{ this.$attrs.isGuest === true ? "Login" : "Logout" }}</v-list-item-title>
					</v-list-item>
				</v-list>
			</v-menu>
			<user-avatar v-bind="$attrs" @toggleMenu="toggleMenu" />
		</div>
	</v-app-bar>
</template>

<script>
import UserAvatar from "../components/UserAvatar";
export default {
	name: "Header",
	components: {
		"user-avatar": UserAvatar,
	},
	props: ["pageTitle"],
	data: function() {
		return {
			showMenu: false,
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
			if (this.$attrs.isGuest === true) {
				this.login();
			} else {
				localStorage.removeItem("RunBPM");
				this.$router.push("/connect");
			}
		},
		login() {
			document.cookie = this.$route.path;
			let sessionData = JSON.parse(localStorage.RunBPM);
			sessionData.isGuest = false;
			localStorage.RunBPM = JSON.stringify(sessionData);
			localStorage.removeItem("RunBPM");
			this.$http
				.get("http://localhost:3000/get-auth-url")
				.then((data) => {
					console.log(data);
					window.location.href = data.data;
				})
				.catch((err) => console.log(err));
		},
	},
};
</script>
<style>
.v-menu__content {
	left: unset !important;
	right: 0px;
}
.header-content {
	width: 100%;
	margin: auto;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
</style>
