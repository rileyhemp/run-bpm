<template>
	<v-card absolute style="z-index: 1000; overflow: hidden" :key="renderKey" :class="$vuetify.breakpoint.mdAndUp ? 'pa-4' : null">
		<v-row class="sticky-row d-flex justify-space-between flex-nowrap px-4 pt-4 pb-3">
			<div class="d-flex flex-wrap flex-row-reverse justify-end">
				<div :class="$vuetify.breakpoint.smAndUp ? 'ml-8' : null" class="controls-group d-flex flex-nowrap">
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn
								icon
								:large="$vuetify.breakpoint.smAndUp"
								:disabled="!tracksAreSelected"
								@click="lockSelected"
								v-on="$vuetify.breakpoint.smAndUp ? on : null"
								><v-icon>mdi-lock</v-icon></v-btn
							>
						</template>
						<span>Lock position</span>
					</v-tooltip>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn
								icon
								:large="$vuetify.breakpoint.smAndUp"
								:disabled="!tracksAreSelected"
								@click="deleteSelected"
								v-on="$vuetify.breakpoint.smAndUp ? on : null"
								><v-icon>mdi-delete</v-icon></v-btn
							>
						</template>
						<span>Delete</span>
					</v-tooltip>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn
								icon
								:large="$vuetify.breakpoint.smAndUp"
								:disabled="!tracksAreSelected"
								@click="deselectAll"
								v-on="$vuetify.breakpoint.smAndUp ? on : null"
								><v-icon>mdi-cancel</v-icon></v-btn
							>
						</template>
						<span>Clear selection</span>
					</v-tooltip>
				</div>
				<div class="controls-group d-flex flex-nowrap">
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn
								icon
								:large="$vuetify.breakpoint.smAndUp"
								:disabled="!tracksAreSelected || topIsSelected || lockedTracksSelected"
								@click="moveTop"
								v-on="$vuetify.breakpoint.smAndUp ? on : null"
								><v-icon :large="$vuetify.breakpoint.smAndUp">mdi-chevron-double-up</v-icon></v-btn
							>
						</template>
						<span>Send to top</span>
					</v-tooltip>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn
								icon
								:large="$vuetify.breakpoint.smAndUp"
								:disabled="!tracksAreSelected || topIsSelected || lockedTracksSelected"
								@click="moveUp"
								v-on="$vuetify.breakpoint.smAndUp ? on : null"
								><v-icon :large="$vuetify.breakpoint.smAndUp">mdi-chevron-up</v-icon></v-btn
							>
						</template>
						<span>Move up</span>
					</v-tooltip>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn
								icon
								:large="$vuetify.breakpoint.smAndUp"
								:disabled="!tracksAreSelected || lastIsSelected || lockedTracksSelected"
								@click="moveDown"
								v-on="$vuetify.breakpoint.smAndUp ? on : null"
								><v-icon :large="$vuetify.breakpoint.smAndUp">mdi-chevron-down</v-icon></v-btn
							>
						</template>
						<span>Move down</span>
					</v-tooltip>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn
								icon
								:large="$vuetify.breakpoint.smAndUp"
								:disabled="!tracksAreSelected || lastIsSelected || lockedTracksSelected"
								@click="moveBottom"
								v-on="$vuetify.breakpoint.smAndUp ? on : null"
								><v-icon :large="$vuetify.breakpoint.smAndUp">mdi-chevron-double-down</v-icon></v-btn
							>
						</template>
						<span>Send to bottom</span>
					</v-tooltip>
				</div>
			</div>
			<div class="d-flex">
				<v-tooltip bottom v-if="!duplicatesRemoved">
					<template v-slot:activator="{ on }">
						<v-btn
							@click="removeDuplicates"
							style="transform: translateY(-3px)"
							icon
							:disabled="getDuplicates === 0"
							:large="$vuetify.breakpoint.smAndUp"
							v-on="$vuetify.breakpoint.smAndUp ? on : null"
							><v-icon>mdi-minus-box-multiple-outline</v-icon></v-btn
						>
					</template>
					<span>Remove duplicates</span>
				</v-tooltip>
				<span class="mr-4 overline" style="transform: translateX(-4px)">{{ getDuplicates() }}</span>
				<v-btn color="primary" class="mr-2" :width="50" @click="close">Done</v-btn>
			</div>
		</v-row>
		<v-list-item class="filter-row">
			<v-list-item-icon class="mx-0"></v-list-item-icon>
			<v-list-item-content :class="$vuetify.breakpoint.smAndDown ? null : 'd-flex flex-row flex-nowrap '">
				<v-list-item-subtitle style="transform: translateX(4px);"
					><span class="actionable" @click="sortBy('title')">Title</span></v-list-item-subtitle
				>
				<v-list-item-subtitle :class="$vuetify.breakpoint.smAndDown ? null : 'px-4'" style="transform: translateX(4px);"
					><span class="actionable" @click="sortBy('artist')">Artist</span></v-list-item-subtitle
				>
			</v-list-item-content>
			<div
				class="track-features"
				:class="$vuetify.breakpoint.smAndDown ? 'pl-4' : null"
				:style="$vuetify.breakpoint.mdAndUp ? 'flex: 0.5' : 'flex: .7'"
			>
				<v-list-item-subtitle style="overflow:visible" :class="$vuetify.breakpoint.smAndDown ? 'text-right' : null"
					><span class="actionable" @click="sortBy('duration_ms')">Duration</span></v-list-item-subtitle
				>
				<v-list-item-subtitle class="ml-4" :class="$vuetify.breakpoint.smAndDown ? 'text-right' : null"
					><span class="actionable" @click="sortBy('doubletime')">Tempo</span></v-list-item-subtitle
				>
				<v-list-item-subtitle class=" d-flex flex-nowrap" v-if="$vuetify.breakpoint.smAndUp">
					<v-list-item-subtitle class="text-right" @click="sortBy('key')">Key</v-list-item-subtitle>
					<v-list-item-subtitle class="mx-1" style="max-width: 8px; text-align: center;">/</v-list-item-subtitle>
					<v-list-item-subtitle style="max-width: 40px" @click="sortBy('mode')">Mode</v-list-item-subtitle>
				</v-list-item-subtitle>
			</div>
		</v-list-item>
		<v-list class="px-0 " style="transform: translateY(60px)">
			<playlist-track
				v-for="(track, index) in sortedPlaylist"
				:key="index + 1"
				:track="track"
				:is_selected="track.is_selected"
				:is_locked="track.is_locked"
				:index="index"
				@onClick="select"
			/>
		</v-list>
	</v-card>
</template>

<script>
import msToHMS from "../scripts/msToHMS";
import _ from "lodash";
import Track from "./Track";
export default {
	props: ["playlist"],
	components: {
		"playlist-track": Track,
	},
	data: function() {
		return {
			sortMethod: "doubletime",
			sortedPlaylist: Object,
			sortHighToLow: true,
			selectedTracks: [],
			tracksAreSelected: false,
			topIsSelected: false,
			lastIsSelected: false,
			reversed: false,
			lastClickedIndex: Number,
			panel: false,
			originalSelection: Object,
			nodes: undefined,
			lockedTracksSelected: false,
			hasMovedItems: false,
			renderKey: 0,
			duplicatesRemoved: false,
		};
	},
	computed: {
		mixDuration: function() {
			let totalLength = 0;
			this.tracks.forEach((track) => {
				totalLength += track.track.duration_ms;
			});
			//Convert time in ms to hours minutes seconds and return
			return msToHMS(totalLength);
		},
	},
	methods: {
		getDuplicates() {
			var unique = _.uniqBy(this.playlist, function(el) {
				return el.id;
			});
			return unique.length;
		},
		removeDuplicates() {
			var unique = _.uniqBy(this.playlist, function(el) {
				return el.id;
			});
			this.sortedPlaylist = unique;
			this.duplicatesRemoved = true;
		},
		getArtist(track) {
			const artists = track.track.artists;
			let names = [];
			if (artists.length > 1) {
				artists.forEach((el) => {
					names.push(el.name);
				});
				return names.join(", ");
			}
			return artists[0].name;
		},
		getValue(value) {
			return Math.floor(value.toFixed(2) * 100);
		},
		getTrackDuration(track) {
			return msToHMS(track.track.duration_ms).split("00:")[1];
		},
		getTrackKey(track) {
			const scale = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
			return scale[track.features.key];
		},
		getTrackMode(track) {
			return track.features.mode ? "major" : "minor";
		},
		close() {
			this.$emit("close", this.sortedPlaylist);
		},
		moveItem(arr, old_index, new_index) {
			console.log(old_index, new_index);
			this.nodes[new_index].classList = this.nodes[old_index].classList;
			this.nodes[old_index].classList.remove("list-item-selected");
			this.hasMovedItems = true;
			if (new_index >= arr.length) {
				var k = new_index - arr.length + 1;
				while (k--) {
					arr.push(undefined);
				}
			}
			arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
			return arr;
		},
		moveUp() {
			this.lastIsSelected = false;
			for (let i = 0; i < this.selectedTracks.length; i++) {
				let track = this.sortedPlaylist[this.selectedTracks[i].index];
				let newIndex = track.index - 1;
				while (this.sortedPlaylist[newIndex - 1] && this.sortedPlaylist[newIndex - 1].is_locked && newIndex > -1) {
					newIndex--;
				}
				this.moveItem(this.sortedPlaylist, track.index, newIndex);
				track.index = this.sortedPlaylist.indexOf(track);
				newIndex === 0 ? (this.topIsSelected = !this.topIsSelected) : null;
			}
		},
		moveDown() {
			this.topIsSelected = false;
			for (let i = this.selectedTracks.length - 1; i > -1; i--) {
				console.log("i", i);
				let track = this.selectedTracks[i];
				console.log("track index", track.index);
				let newIndex = track.index + 1;
				while (this.sortedPlaylist[newIndex + 1] && this.sortedPlaylist[newIndex + 1].is_locked) {
					newIndex++;
				}
				this.moveItem(this.sortedPlaylist, track.index, newIndex);
				track.index = newIndex;
				newIndex === this.sortedPlaylist.length - 1 ? (this.lastIsSelected = true) : null;
			}
		},
		moveTop() {
			while (!this.topIsSelected) {
				this.moveUp();
			}
			const el = document.querySelector(".v-dialog--active");
			el.scrollTop = 0;
		},
		moveBottom() {
			this.topIsSelected = false;
			while (!this.lastIsSelected) {
				this.moveDown();
			}
			const el = document.querySelector(".v-dialog--active");
			el.scrollTop = el.scrollHeight;
		},
		sortSelected(direction) {
			let sortedList;
			if (direction === "up") {
				sortedList = this.selectedTracks.sort((a, b) => {
					return a.index > b.index ? 1 : -1;
				});
				sortedList.forEach((el) => {
					el.index > sortedList.length ? el.index-- : null;
				});
			} else {
				sortedList = this.selectedTracks.sort((a, b) => {
					return a.index > b.index ? -1 : 1;
				});
				sortedList.forEach((el) => {
					el.index > this.sortedPlaylist.length ? el.index++ : null;
				});
			}

			this.selectedTracks = sortedList;
		},
		sortBy(property) {
			let list = this.sortedPlaylist;
			if (property === "artist") {
				if (this.sortHighToLow) {
					list.sort((a, b) => (b.is_locked || a.is_locked ? 0 : this.getArtist(a) < this.getArtist(b) ? 1 : -1));
				} else {
					list.sort((a, b) => (b.is_locked || a.is_locked ? 0 : this.getArtist(a) > this.getArtist(b) ? 1 : -1));
				}
			} else if (property === "title") {
				if (this.sortHighToLow) {
					list.sort((a, b) => (b.is_locked || a.is_locked ? 0 : a.track.name < b.track.name ? 1 : -1));
				} else {
					list.sort((a, b) => (b.is_locked || a.is_locked ? 0 : a.track.name > b.track.name ? 1 : -1));
				}
			} else {
				if (this.sortHighToLow) {
					list.sort((a, b) => (b.is_locked || a.is_locked ? 0 : a.features[property] < b.features[property] ? 1 : -1));
				} else {
					list.sort((a, b) => (b.is_locked || a.is_locked ? 0 : a.features[property] > b.features[property] ? 1 : -1));
				}
			}
			this.sortHighToLow = !this.sortHighToLow;
			this.sortedPlaylist = list;
		},
		deleteSelected() {
			_.pullAll(this.sortedPlaylist, this.selectedTracks);
			this.renderKey++;
			this.deselectAll();
		},
		refreshNodeList() {
			this.nodes = document.querySelectorAll(".list-item");
		},

		select(event) {
			let index = event.index;
			if (this.hasMovedItems) {
				this.deselectAll();
				this.hasMovedItems = false;
			}
			let indexes = [index];
			let indexesToAdd = [];
			if (event.event.shiftKey) {
				let itemsToFill = index - this.lastClickedIndex - 1;
				itemsToFill < 0 ? (itemsToFill = itemsToFill + 2) : null;
				for (let i = 0; i < Math.abs(itemsToFill); i++) {
					let incriment = itemsToFill / Math.abs(itemsToFill);
					indexes.push(this.lastClickedIndex + i * incriment + incriment);
					indexesToAdd.push(this.lastClickedIndex + i * incriment + incriment);
				}
			}
			indexes.sort();
			this.lastClickedIndex = index;
			for (let i = 0; i < indexes.length; i++) {
				this.selectSingle(indexes[i]);
			}
		},
		selectSingle(index) {
			//Checks if the item at position 0 is selected
			index === 0 ? (this.topIsSelected = !this.topIsSelected) : null;
			this.sortedPlaylist[0].is_locked ? (this.topIsSelected = false) : null;
			//Checks if the last item is selected
			index === this.sortedPlaylist.length - 1 ? (this.lastIsSelected = !this.lastIsSelected) : null;
			//Toggles select on the target
			let state = this.sortedPlaylist[index].is_selected;
			this.$set(this.sortedPlaylist, index, { ...this.sortedPlaylist[index], is_selected: !state });
			//Get the selected item
			let track = this.sortedPlaylist[index];
			//Write its index to the object
			this.sortedPlaylist[index].index = index;
			//Add or remove the track from the selected tracks array, sorted by index
			if (this.selectedTracks.some((item) => item.index === track.index)) {
				let index = 0;
				this.selectedTracks.forEach((el) => {
					el.index === track.index;
					index = this.selectedTracks.indexOf(el);
				});
				this.selectedTracks.splice(index, 1);
			} else {
				this.selectedTracks.push(track);
				this.selectedTracks.sort((a, b) => {
					if (a.index > b.index) {
						return 1;
					} else {
						return -1;
					}
				});
			}
			//Indicates to controls whether tracks are selected
			this.tracksAreSelected = this.selectedTracks.length > 0;
			this.areLockedTracksSelected();
		},
		lockSelected() {
			for (let i = 0; i < this.selectedTracks.length; i++) {
				let index = this.sortedPlaylist.indexOf(this.selectedTracks[i]);
				if (index === 0) {
					this.topIsSelected = false;
				} else if (index === this.sortedPlaylist.length - 1) {
					this.lastIsSelected = false;
				}
				let state = this.sortedPlaylist[index].is_locked;
				this.$set(this.sortedPlaylist, index, { ...this.sortedPlaylist[index], is_locked: !state });
			}

			this.deselectAll();
		},
		deselectAll() {
			for (let i = 0; i < this.sortedPlaylist.length; i++) {
				this.sortedPlaylist[i].is_selected = false;
			}
			this.selectedTracks = [];
			this.tracksAreSelected = false;
		},
		areLockedTracksSelected() {
			let state = false;
			let i = this.selectedTracks.length - 1;
			let el = this.selectedTracks;
			while (state === false && i > -1) {
				state = el[i] && el[i].is_selected && el[i].is_locked ? true : false;
				i--;
			}
			this.lockedTracksSelected = state;
		},
	},
	mounted: function() {
		for (let i = 0; i < this.playlist.length; i++) {
			this.playlist[i].id = this.playlist[i].track.id;
			this.playlist[i].is_selected = false;
			this.playlist[i].is_locked = false;
		}
		this.sortedPlaylist = this.playlist;
	},
	updated: function() {
		this.refreshNodeList();
	},
};
</script>
<style lang="scss">
.sticky-row {
	position: fixed;
	top: 0;
	width: 100%;
	padding-top: 16px;
	z-index: 101;
	background-color: #1e1e1e;
	@media screen and (min-width: 900px) {
		top: 56px;
		width: calc(100% - 72px);
	}
}
.filter-row {
	position: fixed;
	top: 0;
	width: 100%;
	padding-bottom: 16px;
	z-index: 1000;
	background-color: #1e1e1e;
	@media screen and (min-width: 900px) {
		top: 110px;
		width: calc(100% - 95px);
	}
}
@media screen and (max-width: 420px) {
	div.v-card div.sticky-row {
		padding-bottom: 0 !important;
	}
}
.controls-container {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	flex-wrap: wrap;
}
.controls-group {
	transform: translateY(-4px);
}
.track-features {
	display: flex;
	justify-content: space-between;
	flex: 1;
	/* @media screen and (min-width: 960px) {
		width: 35%;
	} */
}
.feature {
	/* margin-left: 8px; */
	/* text-align: right; */
	cursor: pointer;
}

.actionable {
	cursor: pointer;
}
.list-item-selected {
	/* background-color: rgba(255, 255, 255, 0.075); */
	background-color: rgba(41, 182, 246, 0.2);
	border-bottom: 0.5px solid rgba(0, 0, 0, 0.2);
	border-top: 0.5px solid rgba(0, 0, 0, 0.2);
}
.list-item-locked {
	opacity: 0.5;
	/* pointer-events: none; */
}
.locked-item-selected {
	/* pointer-events: none; */
	background-color: rgba(255, 255, 255, 0.05);
	border-bottom: 0.5px solid rgba(0, 0, 0, 0.2);
	border-top: 0.5px solid rgba(0, 0, 0, 0.2);
}
.v-list-item {
	padding: 0;
}
.on-hover {
	background-color: transparent;
	@media screen and (min-width: 960px) {
		background-color: rgba(41, 182, 246, 0.2);
	}
}
.v-list-item--link:before {
	background-color: transparent;
	@media screen and (min-width: 960px) {
		background-color: currentColor;
	}
}
</style>
