<template>
	<div class="home"></div>
</template>

<script>
// import jwt from "jsonwebtoken";

// const token = jwt.sign({ username: "rileyhemp" }, "shhhh");

export default {
	name: "Home",
	mounted: function() {
		if (window.localStorage.RunBPM !== undefined) {
			this.$http
				.get(
					`http://localhost:3000/validate-user?${window.localStorage.RunBPM}`
				)
				.then(() => {
					this.$router.push("dashboard");
				})
				.catch(function(err) {
					console.log(err);
				});
		} else {
			this.$router.push("connect");
		}
	}
};
</script>
