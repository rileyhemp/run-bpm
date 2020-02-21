<template>
	<div class="dashboard">
		<bpm-header :pageTitle="this.$router.currentRoute.name" :user="this.userData" />
		<router-view
			:userPlaylists="this.userPlaylists"
			:savedPlaylists="this.savedPlaylists"
			:user="this.userData"
			v-bind="$attrs"
		/>
	</div>
</template>

<script>
import HeaderVue from "../views/Header.vue";
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
			displaySaved: false
		};
	},
	methods: {
		getUserData() {
			this.$http
				.get("http://localhost:3000/get-user-data")
				.then(response => {
					this.userData = response.data.userData;
					this.userPlaylists = response.data.userPlaylists;
					this.$http
						.get(
							`http://localhost:3000/get-saved-playlists?id=${this.userData.id}`
						)
						.then(response => {
							let parsedData = response.data.map(el => {
								return {
									id: el.playlist_id,
									tracks: JSON.parse(el.tracks),
									metadata: JSON.parse(el.metadata)
								};
							});
							this.savedPlaylists = parsedData;
						});
				})
				.catch(err => console.log(err));
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
