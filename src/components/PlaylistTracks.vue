<template>
	<v-card absolute style="z-index: 1000" class="pa-4" :key="this.renderKey">
		<v-row class="sticky-row px-2">
			<v-spacer />
			<v-btn @click="close">Close</v-btn>
		</v-row>
		<v-list two-line class="mx-2 sticky-row sticky-list-item">
			<v-list-item>
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn icon large :disabled="!tracksAreSelected" @click="lockSelected" v-on="on"><v-icon>mdi-lock</v-icon></v-btn>
					</template>
					<span>Lock position</span>
				</v-tooltip>
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn icon large :disabled="!tracksAreSelected" @click="deleteSelected" v-on="on"><v-icon>mdi-delete</v-icon></v-btn>
					</template>
					<span>Delete</span>
				</v-tooltip>
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn icon large :disabled="!tracksAreSelected" @click="deselectAll" v-on="on"><v-icon>mdi-cancel</v-icon></v-btn>
					</template>
					<span>Clear selection</span>
				</v-tooltip>
				<div class="ml-8">
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn icon large :disabled="!tracksAreSelected || topIsSelected" @click="moveTop" v-on="on"
								><v-icon large>mdi-chevron-double-up</v-icon></v-btn
							>
						</template>
						<span>Send to top</span>
					</v-tooltip>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn icon large :disabled="!tracksAreSelected || topIsSelected" @click="moveUp" v-on="on"
								><v-icon large>mdi-chevron-up</v-icon></v-btn
							>
						</template>
						<span>Move up</span>
					</v-tooltip>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn icon large :disabled="!tracksAreSelected || lastIsSelected" @click="moveDown" v-on="on"
								><v-icon large>mdi-chevron-down</v-icon></v-btn
							>
						</template>
						<span>Move down</span>
					</v-tooltip>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn icon large :disabled="!tracksAreSelected || lastIsSelected" @click="moveBottom" v-on="on"
								><v-icon large>mdi-chevron-double-down</v-icon></v-btn
							>
						</template>
						<span>Send to bottom</span>
					</v-tooltip>
				</div>
				<v-spacer></v-spacer>
				<div class="track-features">
					<div @click="sortBy('doubletime')" class="feature actionable overline">BPM</div>
					<div @click="sortBy('energy')" class="feature actionable overline">ENRG</div>
					<div @click="sortBy('instrumentalness')" class="feature actionable overline">INST</div>
					<div @click="sortBy('danceability')" class="feature actionable overline">DANC</div>
					<div @click="sortBy('acousticness')" class="feature actionable overline">ACST</div>
					<div @click="sortBy('valence')" class="feature actionable overline">VLNC</div>
				</div>
			</v-list-item>
		</v-list>
		<v-list two-line class="mx-2">
			<v-hover v-slot:default="{ hover }" v-for="(track, index) in sortedPlaylist" :key="index + 1">
				<v-list-item
					class="actionable list-item"
					:class="
						track.is_locked && !track.is_selected
							? 'list-item-locked'
							: track.is_selected && track.is_locked
							? 'locked-item-selected'
							: track.is_selected
							? 'list-item-selected'
							: null
					"
					@click="select($event, sortedPlaylist.indexOf(track), $el)"
					v-ripple="false"
				>
					<v-icon
						class="mr-2"
						style="pointer-events:all"
						v-if="track.is_locked"
						@click="
							track.is_locked = false;
							select(sortedPlaylist.indexOf(track));
						"
						>mdi-lock</v-icon
					>
					<v-list-item-icon class="mx-0" v-if="!track.is_locked">{{ sortedPlaylist.indexOf(track) + 1 }}</v-list-item-icon>
					<v-list-item-content>
						<v-list-item-title>{{ track.track.name }}</v-list-item-title>
						<v-list-item-subtitle>{{ getArtist(track) }}</v-list-item-subtitle>
					</v-list-item-content>
					<div class="track-features ">
						<div class="feature">{{ track.features.doubletime }}</div>
						<div class="feature">{{ getValue(track.features.energy) }}</div>
						<div class="feature">{{ getValue(track.features.instrumentalness) }}</div>
						<div class="feature">{{ getValue(track.features.danceability) }}</div>
						<div class="feature">{{ getValue(track.features.acousticness) }}</div>
						<div class="feature">{{ getValue(track.features.valence) }}</div>
					</div>
				</v-list-item>
			</v-hover>
		</v-list>
	</v-card>
</template>

<script>
import msToHMS from "../scripts/msToHMS";
import _ from "lodash";
export default {
	props: ["playlist", "tracks"],
	data: function() {
		return {
			sortMethod: "default",
			sortedPlaylist: Object,
			sortHighToLow: true,
			renderKey: 1,
			altRenderKey: 1,
			selectedTracks: [],
			tracksAreSelected: false,
			topIsSelected: false,
			lastIsSelected: false,
			reversed: false,
			lastClickedIndex: Number,
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
		isShiftDown() {
			document.onkeydown = (e) => {
				if (e.shiftKey) {
					return true;
				}
			};
			return false;
		},
	},
	methods: {
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
		close() {
			this.$emit("close");
		},
		moveItem(arr, old_index, new_index) {
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
			if (this.reversed) {
				_.reverse(this.selectedTracks);
				this.reversed = false;
			}
			for (let i = 0; i < this.selectedTracks.length; i++) {
				let track = this.sortedPlaylist[this.selectedTracks[i].index];
				let newIndex = track.index - 1;
				this.moveItem(this.sortedPlaylist, track.index, newIndex);
				track.index = newIndex;
				newIndex === 0 ? (this.topIsSelected = !this.topIsSelected) : null;
			}
		},
		//look into splice API. Collect indexes in an array, number of items, and move all at once.
		moveDown() {
			if (!this.reversed) {
				_.reverse(this.selectedTracks);
				this.reversed = true;
			}
			for (let i = 0; i < this.selectedTracks.length; i++) {
				let track = this.sortedPlaylist[this.selectedTracks[i].index];
				let newIndex = track.index + 1;
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
			let list = this.tracks;
			if (this.sortHighToLow) {
				list.sort((a, b) => (b.is_locked || a.is_locked ? 0 : a.features[property] < b.features[property] ? 1 : -1));
			} else {
				list.sort((a, b) => (b.is_locked || a.is_locked ? 0 : a.features[property] > b.features[property] ? 1 : -1));
			}
			this.sortHighToLow = !this.sortHighToLow;
			this.sortedPlaylist = list;
			this.renderKey++;
		},
		deleteSelected() {
			_.pullAll(this.sortedPlaylist, this.selectedTracks);
			this.deselectAll();
		},
		select(event, index, element) {
			console.log(element);
			let indexes = [index];
			let indexesToAdd = [];
			if (event.shiftKey) {
				let itemsToFill = index - this.lastClickedIndex - 1;
				itemsToFill < 0 ? (itemsToFill = itemsToFill + 2) : null;
				console.log(itemsToFill);
				for (let i = 0; i < Math.abs(itemsToFill); i++) {
					let incriment = itemsToFill / Math.abs(itemsToFill);
					indexes.push(this.lastClickedIndex + i * incriment + incriment);
					indexesToAdd.push(this.lastClickedIndex + i * incriment + incriment);
					console.log(indexesToAdd);
				}
				const nodes = document.querySelectorAll(".list-item");
				for (let i = 0; i < indexesToAdd.length; i++) {
					let target = nodes[indexesToAdd[i]];
					target.classList.contains("list-item-selected")
						? target.classList.remove("list-item-selected")
						: target.classList.add("list-item-selected");
				}
			}
			indexes.sort();
			console.log(indexes);
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
			this.sortedPlaylist[index].is_selected = !this.sortedPlaylist[index].is_selected;
			//Get the selected item
			let track = this.sortedPlaylist[index];
			//Write its index to the object
			this.sortedPlaylist[index].index = index;
			//Add or remove the track from the selected tracks array, sorted by index
			if (this.selectedTracks.includes(track)) {
				this.selectedTracks = _.pull(this.selectedTracks, track);
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
		},
		lockSelected() {
			for (let i = 0; i < this.selectedTracks.length; i++) {
				let index = this.sortedPlaylist.indexOf(this.selectedTracks[i]);
				this.sortedPlaylist[index].is_locked = !this.sortedPlaylist[index].is_locked;
			}
			this.deselectAll();
		},
		deselectAll() {
			for (let i = 0; i < this.sortedPlaylist.length; i++) {
				this.sortedPlaylist[i].is_selected = false;
			}
			this.selectedTracks = [];
			this.tracksAreSelected = false;
			this.renderKey++;
		},
	},
	mounted: function() {
		for (let i = 0; i < this.tracks.length; i++) {
			this.tracks[i].id = this.tracks[i].track.id;
		}
		this.sortedPlaylist = this.tracks;
	},
};
</script>
<style>
.sticky-row {
	position: sticky;
	top: 16px;
	z-index: 101;
}
.sticky-list-item {
	top: 0px;
	margin-top: -64px;
	background-color: #1e1e1e;
	z-index: 100;
	padding-top: 64px;
}
.track-features {
	display: flex;
	width: 35%;
	justify-content: space-between;
}
.feature {
	margin-left: 8px;
	text-align: right;
	cursor: pointer;
}
.actionable {
	cursor: pointer;
}
.list-item-selected {
	background-color: rgba(255, 255, 255, 0.05);
	border-bottom: 0.5px solid rgba(0, 0, 0, 0.2);
	border-top: 0.5px solid rgba(0, 0, 0, 0.2);
}
.list-item-locked {
	opacity: 0.5;
	pointer-events: none;
}
.locked-item-selected {
	pointer-events: none;
	background-color: rgba(255, 255, 255, 0.05);
	border-bottom: 0.5px solid rgba(0, 0, 0, 0.2);
	border-top: 0.5px solid rgba(0, 0, 0, 0.2);
}
</style>
