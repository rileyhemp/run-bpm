export function getCurrentTrack() {
	clearInterval(this.counter);
	this.disableButtons = false;
	this.$http
		.get(`https://d2ob92q3jfbd5e.cloudfront.net/player?q=current&credentials=${localStorage.RunBPM}`)
		.then(response => {
			this.currentTrack.id = response.data;
			this.currentTrack.isPlaying = response.data.is_playing;
			if (response.data.item) {
				this.getTrackDetails(response.data.item.id);
			}
			if (response.data.is_playing) {
				this.currentTrack.duration = response.data.item.duration_ms;
				this.initTimer(response.data.progress_ms, response.data.item.duration_ms);
			}
		})
		.catch(err => console.log(err));
}
export function getTrackDetails(id) {
	this.$http.get(`https://d2ob92q3jfbd5e.cloudfront.net/analyze-tracks?id=${id}&credentials=${localStorage.RunBPM}`).then(response => {
		this.currentTrack.audioFeatures = response.data;
	});
}
export function initTimer(progress, duration) {
	const self = this;
	//Not perfect, latency compensation
	progress = progress - 500;
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
			.put(`https://d2ob92q3jfbd5e.cloudfront.net/player?action=play&credentials=${localStorage.RunBPM}`, {
				data: {
					...options
				}
			})
			.then(() => this.getCurrentTrack())
			.catch(error => console.log(error));
	};
	const pause = () => {
		this.$http
			.put(`https://d2ob92q3jfbd5e.cloudfront.net/player?action=pause&credentials=${localStorage.RunBPM}`)
			.then(() => this.getCurrentTrack())
			.catch(error => console.log(error));
	};
	const previous = () => {
		this.$http
			.put(`https://d2ob92q3jfbd5e.cloudfront.net/player?action=previous&credentials=${localStorage.RunBPM}`, {
				data: this.options
			})
			.then(() => this.getCurrentTrack())
			.catch(error => console.log(error));
	};
	const next = () => {
		this.$http
			.put(`https://d2ob92q3jfbd5e.cloudfront.net/player?action=next&credentials=${localStorage.RunBPM}`)
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
