export function getCurrentTrack() {
	this.disablePlayButton = false;
	this.$http
		.get("http://localhost:3000/player?q=current")
		.then(response => {
			this.currentTrack.id = response.data;
			this.currentTrack.isPlaying = response.data.is_playing;
			if (response.data.item.id) {
				this.getTrackDetails(response.data.item.id);
			}
			if (response.data.is_playing) {
				this.currentTrack.duration =
					response.data.item.duration_ms;
				this.initTimer(
					response.data.progress_ms,
					response.data.item.duration_ms
				);
			}
		})
		.catch(err => console.log(err));
}
export function getTrackDetails(id) {
	this.$http
		.get(`http://localhost:3000/analyze-tracks?id=${id}`)
		.then(response => {
			this.currentTrack.audioFeatures = response.data;
		});
}
export function initTimer(progress, duration) {
	//Catch element for use in interval
	const self = this;
	//Not perfect, but due to latency progress needs to start back one second to match Spotify.
	progress = progress - 1000;
	let i = setInterval(() => {
		progress = progress + 1000;
		self.currentTrack.progress = progress;
		if (progress >= duration) {
			clearInterval(i);
			this.getCurrentTrack();
		}
	}, 1000);
}
/* eslint indent: 0 */
export function updatePlayState(event) {
	this.disablePlayButton = true;
	let options = {};
	if (event.device) {
		this.userData.activeDevice = event.device;
		options.device_id = event.device;
	} else {
		options.device_id = this.userData.activeDevice;
	}
	if (event.content) {
		options.context_uri = event.content;
	}
	const play = () => {
		this.$http
			.put("http://localhost:3000/player?action=play", {
				data: {
					...options
				}
			})
			.then(() => this.getCurrentTrack())
			.catch(error => console.log(error));
	};
	const pause = () => {
		this.$http
			.put("http://localhost:3000/player?action=pause")
			.then(() => this.getCurrentTrack())
			.catch(() => console.log("pause broke somewhere"));
	};
	const previous = () => {
		console.log("previous was called");
		this.$http
			.put("http://localhost:3000/player?action=previous", {
				data: this.options
			})
			.then(() => console.log("previous"))
			.catch(() => console.log("previous broke somewhere"));
	};
	const next = () => {
		console.log("next was called");
		this.$http
			.put("http://localhost:3000/player?action=next", {
				data: this.options
			})
			.then(() => console.log("next"))
			.catch(() => console.log("next broke somewhere"));
	};
	switch (event.state) {
		case "play":
			play();
			break;
		case "pause":
			pause();
			break;
		case "previous":
			previous();
			break;
		case "next":
			next();
			break;
		default:
			console.log("Play state missing");
	}
}