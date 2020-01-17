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
	methods: {
		call(method, query, options) {
			return this.$http
				.get("http://localhost:3000/api", {
					params: {
						method: method,
						query: query,
						options: options
					}
				})
				.then(function(data) {
					return data.data;
				});
		}
	},
	mounted: async function() {
		this.userData = await this.call("getMe");
	}
};
</script>
