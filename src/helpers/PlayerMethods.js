export function getCurrentTrack() {
	clearInterval(this.counter)
	this.disableButtons = false;
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
	const self = this;
	//Not perfect, but due to latency progress needs to start back one second to match Spotify.
	progress = progress - 1000;
	this.counter = setInterval(() => {
		progress = progress + 1000;
		self.currentTrack.progress = progress;
		if (progress >= duration) {
			clearInterval(self.counter);
			this.getCurrentTrack();
		}
	}, 1000);
}
/* eslint indent: 0 */
export function updatePlayState(event) {
	this.disableButtons = true;
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
			.catch(error => console.log(error));
	};
	const previous = () => {
		this.$http
			.put("http://localhost:3000/player?action=previous", {
				data: this.options
			})
			.then(() => this.getCurrentTrack())
			.catch(error => console.log(error));
	};
	const next = () => {
		this.$http
			.put("http://localhost:3000/player?action=next")
			.then(() => this.getCurrentTrack())
			.catch(error => console.log(error));
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