<template>
	<div />
</template>

<script>
export default {
	name: "Redirect",
	mounted: function() {
		//Register user via API
		this.$http
			.get(`http://localhost:3000/authorize${window.location.search}`)
			.then(data => {
				window.localStorage.RunBPM = data.data;
				this.$router.push("dashboard");
			});
	}
};
</script>
