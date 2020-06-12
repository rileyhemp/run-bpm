<template>
	<div class="dashboard">
		<v-overlay :value="loading" :z-index="1000">
			<v-progress-circular indeterminate size="64"></v-progress-circular>
		</v-overlay>
		<bpm-header :pageTitle="this.$router.currentRoute.name" :isGuest="this.isGuest" :user="this.userData" class="d-md-none" />
		<v-navigation-drawer v-if="$vuetify.breakpoint.mdAndUp" class="d-md-flex d-sm-none" absolute :userData="userData" permanent>
			<v-list dense nav class="py-0">
				<div class="d-md-flex d-sm-none logo-text" />
				<v-list-item two-line>
					<user-avatar :user="this.userData" class="mr-4" />
					<v-list-item-content class="mt-2">
						<v-list-item-title>{{ userData.display_name }}</v-list-item-title>
						<v-list-item-subtitle style="cursor: pointer" @click="logout">Logout</v-list-item-subtitle>
					</v-list-item-content>
				</v-list-item>

				<v-divider></v-divider>

				<v-list-item><v-icon>mdi-home</v-icon><v-btn to="/" block class="justify-start" text>Home</v-btn></v-list-item>
				<v-list-item><v-icon>mdi-plus</v-icon><v-btn to="/import" block class="justify-start" text>Import</v-btn></v-list-item>
				<v-list-item
					><v-icon :color="$route.name != 'Create' && $route.name != 'Save' ? 'grey darken-2' : 'white'">mdi-chart-bar</v-icon
					><v-btn :disabled="$route.name != 'Create' && $route.name != 'Save'" to="/create" block class="justify-start" text
						>Create</v-btn
					></v-list-item
				>
				<v-list-item
					><v-icon :color="$route.name != 'Save' ? 'grey darken-2' : 'white'">mdi-content-save</v-icon
					><v-btn :disabled="$route.name != 'Save'" to="/save" block class="justify-start" text>Save</v-btn></v-list-item
				>
			</v-list>
		</v-navigation-drawer>
		<router-view
			:class="$vuetify.breakpoint.mdAndUp ? 'px-8' : null"
			:userPlaylists="this.userPlaylists"
			:isGuest="this.isGuest"
			:CreatedPlaylists="this.CreatedPlaylists"
			:userDevices="this.userDevices"
			:user="this.userData"
			:loading="this.loading"
			:disableButtons="this.disableButtons"
			v-bind="$attrs"
			@updatePlaylists="updatePlaylists"
			@updateUserInfo="getUserData"
			@loading="loading = true"
		/>
	</div>
</template>

<script>
import UserAvatar from "../components/UserAvatar";
import HeaderVue from "../containers/Header.vue";
export default {
	name: "Dashboard",
	components: {
		"bpm-header": HeaderVue,
		"user-avatar": UserAvatar,
	},
	data: function() {
		return {
			userData: Object,
			userPlaylists: Object,
			CreatedPlaylists: Object,
			userDevices: Object,
			isGuest: Boolean,
			disableButtons: false,
			displaySaved: false,
			loading: false,
		};
	},
	methods: {
		logout() {
			localStorage.removeItem("RunBPM");
			this.$router.push("/connect");
		},
		getUserData() {
			let userCredientials = JSON.parse(localStorage.RunBPM);
			if (!userCredientials.isGuest) {
				this.loading = true;
				this.$http
					.get("http://https://d2ob92q3jfbd5e.cloudfront.net/get-user-data", {
						params: {
							credentials: localStorage.RunBPM,
						},
					})
					.then((response) => {
						this.userData = response.data.userData;
						this.userPlaylists = response.data.userPlaylists;
						this.userDevices = response.data.userDevices;
						this.updatePlaylists();
						userCredientials.accessToken = response.data.userCredentials.token;
						userCredientials.expiresAt = response.data.userCredentials.expiresAt;
						localStorage.RunBPM = JSON.stringify(userCredientials);
					})
					.catch((err) => {
						//If access token throws an error, the server will request a new one.
						userCredientials.accessToken = err.response.data;
						localStorage.RunBPM = JSON.stringify(userCredientials);
						//Retry with new access token
						this.getUserData();
					});
			} else {
				this.isGuest = true;
				this.userData = {
					display_name: "Guest",
				};
			}
		},
		updatePlaylists() {
			this.$http
				.get(`http://https://d2ob92q3jfbd5e.cloudfront.net/playlists?id=${this.userData.id}&credentials=${localStorage.RunBPM}`)
				.then((response) => {
					let parsedData = response.data.map((el) => {
						return {
							id: el.playlist_id,
							tracks: JSON.parse(el.tracks),
							metadata: JSON.parse(el.metadata),
						};
					});
					this.CreatedPlaylists = parsedData;
					this.loading = false;
				})
				.catch((err) => {
					this.loading = false;
					console.log(err);
				});
		},
	},
	mounted: function() {
		if (Object.entries(this.userData).length === 0) {
			this.getUserData();
		}
	},
};
</script>
<style>
.logo-text {
	background-image: url("../assets/logo-text.png");
	background-size: contain;
	height: 50px;
	width: 80%;
	margin-top: 24px;
	margin-left: 8px;
}
@media screen and (min-width: 960px) {
	.dashboard {
		width: 100%;
		padding-left: 250px;
	}
}
.sticky-nav {
	position: sticky;
	top: 0px;
	z-index: 190;
	background-color: black;
	padding: 12px 0;
}
</style>
