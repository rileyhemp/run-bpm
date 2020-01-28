<template>
	<v-app-bar>
		<v-toolbar-title>{{pageTitle}}</v-toolbar-title>
		<v-spacer></v-spacer>
		<user-profile />
	</v-app-bar>
</template>

<script>
import UserProfile from "../components/UserProfile";
export default {
	name: "Header",
	components: {
		"user-profile": UserProfile
	},
	props: ["pageTitle"]
};
</script>