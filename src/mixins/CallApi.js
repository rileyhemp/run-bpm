export default {
	methods: {
		callSpotifyApi(method, query, options) {
			return this.$http
				.get("http://localhost:3000/api", {
					params: {
						method: method,
						query: query,
						options: options
					}
				})
				.then(function (data) {
					return data.data;
				});
		}
	}
}