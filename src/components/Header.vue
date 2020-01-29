<template>
	<v-app-bar flat>
		<v-toolbar-title>{{pageTitle}}</v-toolbar-title>
		<v-spacer />
		<user-profile v-bind="$attrs" />
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