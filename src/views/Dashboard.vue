<template>
	<div class="dashboard">
		<h1>Hello {{this.userData.display_name}}!</h1>
	</div>
</template>

<script>
export default {
	data: function() {
		return {
			userData: Object,
			userPlaylists: Object
		};
	},
	mounted: async function() {
		this.userData = await this.call("getMe");
		this.userPlaylists = await this.call("getUserPlaylists");
	}
};
</script>
