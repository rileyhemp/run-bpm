<template>
	<v-card>
		<div class="sticky-row pt-5 pl-8 pr-6">
			<v-btn-toggle rounded>
				<v-btn>
					<v-icon>mdi-chevron-double-up</v-icon>
				</v-btn>
				<v-btn>
					<v-icon>mdi-chevron-up</v-icon>
				</v-btn>
				<v-btn>
					<v-icon>mdi-chevron-down</v-icon>
				</v-btn>
				<v-btn>
					<v-icon>mdi-chevron-double-down</v-icon>
				</v-btn>
			</v-btn-toggle>
			<v-btn-toggle rounded>
				<v-btn>
					<v-icon>mdi-lock</v-icon>
				</v-btn>
				<v-btn>
					<v-icon>mdi-delete</v-icon>
				</v-btn>
				<v-btn>
					<v-icon>mdi-cancel</v-icon>
				</v-btn>
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
			<v-btn-toggle rounded @click.native="menuFix">
				<v-btn>
					<v-icon>mdi-close</v-icon>
				</v-btn>
				<v-btn>
					<v-icon>mdi-check</v-icon>
				</v-btn>
			</v-btn-toggle>
		</div>
		<v-divider></v-divider>
		<v-list class="px-4 pt-0 tracks-list">
			<playlist-track :selectedFilters="selectedFilters" :is_header="true" :is_locked="false" :is_selected="false" :track="header" />
			<playlist-track
				style="transform: translateY(-16px)"
				:selectedFilters="selectedFilters"
				v-for="(track, index) in sortedPlaylist"
				:key="index + 1"
				:track="track"
				:is_selected="track.is_selected"
				:is_locked="track.is_locked"
				:index="index"
				:is_header="false"
				@onClick="select"
			/>
		</v-list>
	</v-card>
</template>

<script>
import _ from "lodash";
import Track from "../components/Track";
export default {
	props: ["playlist", "filters"],
	components: {
		"playlist-track": Track,
	},
	data: function() {
		return {
			selectedTracks: [],
			visibleFilters: [],
			selectedFilters: [1, 8],
			available_filters: [
				{ text: "Tempo (doubletime)", value: 1 },
				{ text: "Tempo (original)", value: 2 },
				{ text: "Key / Mode", value: 8 },
				{ text: "Valence", value: 3 },
				{ text: "Energy", value: 4 },
				{ text: "Instrumentalness", value: 5 },
				{ text: "Danceability", value: 6 },
				{ text: "Acousticness", value: 7 },
			],
			sortedPlaylist: Object,
			tracksAreSelected: false,
			topIsSelected: false,
			lastIsSelected: false,
			lockedTracksSelected: false,
			duplicatesRemoved: false,
			header: {
				// Dummy content for list header
				track: {
					name: "Name",
					artists: [{ name: "Artist" }],
				},
				is_locked: false,
				is_selected: false,
			},
		};
	},
	methods: {
		enforceMaxFilters() {
			//TODO ====> Let them select more if the screen is larger
			this.selectedFilters.length > 2 ? this.selectedFilters.shift() : null;
		},
		menuFix() {
			let dropdown = document.querySelector(".menuable__content__active");
			dropdown != null ? dropdown.classList.remove("v-menu__content") : null;
		},
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
		// refreshNodeList() {
		// 	this.nodes = document.querySelectorAll(".list-item");
		// },

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
		document.querySelector(".select-filters").addEventListener("click", this.menuFix);
	},
	updated: function() {},
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
.tracks-list {
	/* transform: translateY(32px); */
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
	transform: translateY(-4px);
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