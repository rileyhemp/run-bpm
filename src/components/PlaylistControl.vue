<template>
	<v-tooltip bottom>
		<template v-slot:activator="{ on }">
			<v-btn outlined @click="handleClick" v-on="on" :disabled="disabled" :class="special_class">
				<v-icon>{{ icon }}</v-icon>
			</v-btn>
		</template>
		<span>{{ tooltip }}</span>
	</v-tooltip>
</template>

<script>
export default {
	props: ["icon", "tooltip", "disabled", "special_class"],
	data: function() {
		return {};
	},
	methods: {
		handleClick: function() {
			this.$emit("click");
		},
	},
};
</script>
<style scoped lang="scss"></style>
