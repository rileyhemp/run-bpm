<template>
	<div class="launch-playlist">
		<v-btn icon outlined class="mr-2" @click="active ? pause() : dialog = true">
			<v-icon>{{ active ? 'mdi-pause' : 'mdi-play' }}</v-icon>
		</v-btn>
		<v-dialog v-model="dialog" persistent max-width="300">
			<v-card>
				<v-card-title class="headline">Select a device</v-card-title>
				<v-card-actions>
					<v-btn-toggle borderless>
						<v-btn
							v-for="device in devices"
							:key="device.key"
							:value="device.id"
							text
							block
							class="plain-btn justify-start"
							@click="play(device.id)"
						>
							<v-icon class="mr-2">{{getIcon(device.type)}}</v-icon>
							<span>{{device.name}}</span>
						</v-btn>
					</v-btn-toggle>
				</v-card-actions>
				<v-row class="d-flex flex-row-reverse px-4">
					<v-btn icon @click="refreshDevices">
						<v-icon>mdi-refresh</v-icon>
					</v-btn>
				</v-row>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
export default {
	data: function() {
		return {
			dialog: false,
			active: false
		};
	},
	computed: {
		devices: function() {
			return this.$attrs.userDevices.devices;
		}
	},
	methods: {
		getIcon(type) {
			return type === "Computer" ? "mdi-laptop" : null;
		},
		refreshDevices() {
			this.$emit("updateUserInfo");
		},
		play(deviceID) {
			this.$emit("play", deviceID);
			this.active = true;
			this.dialog = false;
		},
		pause() {
			this.$emit("pause");
			this.active = false;
		}
	}
};
</script>

<style scoped>
.v-btn-toggle {
	flex-direction: column;
	flex: 1;
}
.justify-start {
	justify-content: start;
}
.plain-btn:hover:before {
	background-color: transparent;
}
</style>