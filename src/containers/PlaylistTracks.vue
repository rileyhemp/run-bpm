<template>
	<v-card>
		<div
			class="sticky-row controls-group"
			:class="$vuetify.breakpoint.xsOnly ? 'px-0 mx-0 pb-0 mb-0' : $vuetify.breakpoint.smAndDown ? 'px-2 mx-0 pb-0 mb-0' : 'pt-5 pl-8 pr-6'"
		>
			<v-btn-toggle rounded :class="$vuetify.breakpoint.smAndDown ? 'pb-2' : null">
				<playlist-control
					icon="mdi-chevron-double-up"
					tooltip="Send to top"
					@click="moveTop"
					:disabled="!tracksAreSelected || topIsSelected || lockedTracksSelected"
				/>
				<playlist-control
					icon="mdi-chevron-up"
					tooltip="Move up"
					@click="moveUp"
					:disabled="!tracksAreSelected || topIsSelected || lockedTracksSelected"
				/>
				<playlist-control
					icon="mdi-chevron-down"
					tooltip="Move down"
					@click="moveDown"
					:disabled="!tracksAreSelected || lastIsSelected || lockedTracksSelected"
				/>
				<playlist-control
					icon="mdi-chevron-double-down"
					tooltip="Send to bottom"
					@click="moveBottom"
					:disabled="!tracksAreSelected || lastIsSelected || lockedTracksSelected"
				/>
			</v-btn-toggle>
			<v-btn-toggle rounded :class="$vuetify.breakpoint.smAndDown ? 'pb-2' : null">
				<playlist-control icon="mdi-lock" tooltip="Lock selected" @click="lockSelected" :disabled="!tracksAreSelected" />
				<playlist-control icon="mdi-delete" tooltip="Delete" @click="deleteSelected" :disabled="!tracksAreSelected || lockedTracksSelected" />
				<playlist-control
					icon="mdi-cancel"
					v-if="$vuetify.breakpoint.mdAndUp"
					tooltip="Clear selection"
					@click="deselectAll"
					:disabled="!tracksAreSelected"
				/>
				<playlist-control
					icon="mdi-minus-box-multiple-outline"
					:disabled="numberOfDuplicates === 0"
					:tooltip="`Remove duplicates (${numberOfDuplicates})`"
					@click="
						confirm = true;
						action = 'remove duplicates';
					"
				/>
			</v-btn-toggle>
			<v-overflow-btn
				rounded
				@input="enforceMaxFilters"
				v-model="selectedFilters"
				:items="available_filters"
				multiple
				prefix="Select filters"
				class="ma-0 pa-0 select-filters"
			/>
			<v-btn-toggle rounded>
				<playlist-control
					icon="mdi-close"
					color="error"
					tooltip="Cancel"
					@click="
						() => {
							if (!changed) {
								cancel();
							} else {
								confirm = true;
								action = 'cancel';
							}
						}
					"
					special_class="red-hover"
				/>
				<playlist-control
					icon="mdi-check"
					color="success"
					tooltip="Save"
					:disabled="!changed"
					@click="
						confirm = true;
						action = 'save';
					"
					special_class="green-hover"
				/>
			</v-btn-toggle>
		</div>
		<v-list class="tracks-list" :class="$vuetify.breakpoint.smAndDown ? 'pl-0 pr-1 py-0' : 'px-4 pt-0'">
			<playlist-track
				@onSort="sortBy"
				:selectedFilters="selectedFilters"
				:is_header="true"
				:is_locked="false"
				:is_selected="false"
				:track="header"
				:filters="available_filters"
			/>
			<playlist-track
				@onClick="select"
				:selectedFilters="selectedFilters"
				v-for="(track, index) in sortedPlaylist"
				:key="index + 1"
				:track="track"
				:is_selected="track.is_selected"
				:is_locked="track.is_locked"
				:index="index"
				:is_header="false"
				:filters="available_filters"
			/>
		</v-list>
		<v-dialog v-model="confirm" max-width="300">
			<v-card class="d-flex align-center flex-column">
				<v-card-title class="title">{{
					action === "save"
						? "Save changes?"
						: action === "cancel"
						? "Delete changes?"
						: action === "remove duplicates"
						? "Remove " + numberOfDuplicates + " duplicates?"
						: null
				}}</v-card-title>

				<v-card-actions>
					<v-btn color="error" text @click="confirm = false">
						No
					</v-btn>

					<v-btn
						color="success"
						text
						@click="
							action === 'save' ? close() : action === 'cancel' ? cancel() : action === 'remove duplicates' ? removeDuplicates() : null
						"
					>
						Yes
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-card>
</template>

<script>
import _ from "lodash";
import Track from "../components/Track";
import Control from "../components/PlaylistControl";
export default {
	props: ["playlist", "filters"],
	components: {
		"playlist-track": Track,
		"playlist-control": Control,
	},
	data: function() {
		return {
			selectedTracks: [],
			visibleFilters: [],
			selectedFilters: [1, 2],
			available_filters: [
				{ text: "Duration", value: 0, id: "duration_ms" },
				{ text: "Tempo (doubletime)", value: 1, id: "doubletime" },
				{ text: "Key / Mode", value: 2, id: "key" },
				{ text: "Tempo (original)", value: 3, id: "tempo" },
				{ text: "Valence", value: 4, id: "valence" },
				{ text: "Energy", value: 5, id: "energy" },
				{ text: "Instrumentalness", value: 6, id: "instrumentalness" },
				{ text: "Danceability", value: 7, id: "danceability" },
				{ text: "Acousticness", value: 8, id: "acousticness" },
			],
			sortedPlaylist: Object,
			tracksAreSelected: false,
			topIsSelected: false,
			lastIsSelected: false,
			lockedTracksSelected: false,
			numberOfDuplicates: Number,
			duplicatesRemoved: false,
			nodes: undefined,
			confirm: false,
			action: String,
			changed: false,
			header: {
				is_locked: false,
				is_selected: false,
			},
		};
	},
	computed: {
		maxFilters: function() {
			return this.$vuetify.breakpoint.smAndDown
				? 2
				: this.$vuetify.breakpoint.mdAndDown
				? 3
				: this.$vuetify.breakpoint.lgAndDown
				? 7
				: this.$vuetify.breakpoint.xlOnly
				? 9
				: null;
		},
	},
	methods: {
		enforceMaxFilters() {
			this.selectedFilters.length > this.maxFilters ? this.selectedFilters.shift() : null;
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
		menuFix() {
			let dropdown = document.querySelector(".menuable__content__active");
			dropdown != null ? dropdown.classList.remove("v-menu__content") : null;
		},
		getDuplicates() {
			var unique = _.uniqBy(this.playlist, function(el) {
				return el.id;
			});
			this.numberOfDuplicates = this.sortedPlaylist.length - unique.length;
		},
		removeDuplicates() {
			this.changed = true;
			var unique = _.uniqBy(this.playlist, function(el) {
				return el.id;
			});
			this.sortedPlaylist = unique;
			this.numberOfDuplicates = 0;
			this.confirm = false;
		},
		close() {
			this.$emit("close", this.sortedPlaylist);
		},
		cancel() {
			this.$emit("cancel");
			this.confirm = false;
		},
		moveItem(arr, old_index, new_index) {
			this.changed = true;
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
				let track = this.selectedTracks[i];
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
		sortBy(event) {
			this.changed = true;
			const property = event.event;
			let list = this.sortedPlaylist;
			if (property === "artist") {
				if (this.sortHighToLow) {
					list.sort((a, b) => (b.is_locked || a.is_locked ? 0 : this.getArtist(a) < this.getArtist(b) ? 1 : -1));
				} else {
					list.sort((a, b) => (b.is_locked || a.is_locked ? 0 : this.getArtist(a) > this.getArtist(b) ? 1 : -1));
				}
			} else if (property === "name") {
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
			this.changed = true;
			_.pullAll(this.sortedPlaylist, this.selectedTracks);
			this.renderKey++;
			this.deselectAll();
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
		refreshNodeList() {
			this.nodes = document.querySelectorAll(".list-item");
		},
	},
	mounted: function() {
		for (let i = 0; i < this.playlist.length; i++) {
			this.playlist[i].id = this.playlist[i].track.id;
			this.playlist[i].is_selected = false;
			this.playlist[i].is_locked = false;
		}
		this.sortedPlaylist = this.playlist;
		document.querySelector(".select-filters").addEventListener("click", this.menuFix);
		this.getDuplicates();
		this.enforceMaxFilters();
		for (let i = 0; i < this.maxFilters - this.selectedFilters.length; i++) {
			this.selectedFilters.push(2 + i);
		}
	},
	updated: function() {
		this.refreshNodeList();
	},
};
</script>
<style scoped lang="scss">
.sticky-row {
	position: sticky;
	display: flex;
	justify-content: space-between;
	/* align-items: center; */
	top: 0;
	width: 100%;
	padding-top: 16px;
	z-index: 101;
	background-color: #1e1e1e;
}
.select-filters {
	max-width: 200px;
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
	flex-wrap: wrap;
	justify-content: space-around;
	@media screen and (min-width: 660px) {
		justify-content: space-between;
	}
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

.v-list-item--link:before {
	background-color: transparent;
	@media screen and (min-width: 960px) {
		background-color: currentColor;
	}
}
</style>
