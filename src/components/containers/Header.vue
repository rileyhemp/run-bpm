<template>
	<v-app-bar flat>
		<v-toolbar-title>{{pageTitle}}</v-toolbar-title>
		<v-spacer />
		<user-avatar v-bind="$attrs" />
	</v-app-bar>
</template>

<script>
import UserAvatar from "../single_purpose/UserAvatar";
export default {
	name: "Header",
	components: {
		"user-avatar": UserAvatar
	},
	props: ["pageTitle"]
};
</script>