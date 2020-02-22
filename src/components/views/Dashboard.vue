<template>
	<div class="dashboard">
		<v-overlay :value="loading" :z-index="1000">
			<v-progress-circular indeterminate size="64"></v-progress-circular>
		</v-overlay>
		<bpm-header :pageTitle="this.$router.currentRoute.name" :user="this.userData" />
		<router-view
			:userPlaylists="this.userPlaylists"
			:savedPlaylists="this.savedPlaylists"
			:userDevices="this.userDevices"
			:user="this.userData"
			:loading="this.loading"
			v-bind="$attrs"
			@updatePlaylists="updatePlaylists"
			@updateUserInfo="getUserData"
		/>
	</div>
</template>

<script>
import HeaderVue from "../containers/Header.vue";
export default {
	name: "Dashboard",
	components: {
		"bpm-header": HeaderVue
	},
	data: function() {
		return {
			userData: Object,
			userPlaylists: Object,
			savedPlaylists: Object,
			userDevices: Object,
			displaySaved: false,
			loading: false
		};
	},
	methods: {
		getUserData() {
			this.loading = true;
			this.$http
				.get("http://localhost:3000/get-user-data")
				.then(response => {
					this.userData = response.data.userData;
					this.userPlaylists = response.data.userPlaylists;
					this.userDevices = response.data.userDevices;
					this.updatePlaylists();
					this.loading = false;
				})
				.catch(err => {
					this.loading = false;
					console.log(err);
				});
		},
		updatePlaylists() {
			this.loading = true;
			this.$http
				.get(`http://localhost:3000/playlists?id=${this.userData.id}`)
				.then(response => {
					let parsedData = response.data.map(el => {
						return {
							id: el.playlist_id,
							tracks: JSON.parse(el.tracks),
							metadata: JSON.parse(el.metadata)
						};
					});
					this.savedPlaylists = parsedData;
					this.loading = false;
				})
				.catch(err => {
					this.loading = false;
					console.log(err);
				});
		}
	},
	//create user is authenticated function
	mounted: function() {
		if (window.localStorage.RunBPM !== undefined) {
			this.$http
				.get(
					`http://localhost:3000/validate-user?${window.localStorage.RunBPM}`
				)
				.then(() => {
					this.getUserData();
				})
				.catch(err => console.log(err));
		} else {
			this.$router.push("connect");
		}
	}
};
</script>
