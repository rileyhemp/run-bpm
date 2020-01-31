<template>
	<div class="dashboard">
		<bpm-header :pageTitle="this.$router.currentRoute.name" :user="this.userData" />
		<router-view :playlists="this.userPlaylists" :user="this.userData" />
	</div>
</template>

<script>
import HeaderVue from "../components/Header.vue";
export default {
	name: "Dashboard",
	components: {
		"bpm-header": HeaderVue
	},
	data: function() {
		return {
			userData: Object,
			userPlaylists: Object
		};
	},
	methods: {
		getUserData() {
			this.$http
				.get("http://localhost:3000/get-user-data")
				.then(data => {
					console.log(data);
					this.userData = data.data.userData;
					this.userPlaylists = data.data.userPlaylists;
				})
				.catch(err => console.log(err));
		}
	},
	mounted: function() {
		if (window.localStorage.RunBPM !== undefined) {
			this.$http
				.get(
					`http://localhost:3000/validate-user?${window.localStorage.RunBPM}`
				)
				.then(() => {
					console.log("user is authenticated");
					this.getUserData();
				})
				.catch(err => console.log(err));
		} else {
			this.$router.push("connect");
		}
	}
};
</script>
