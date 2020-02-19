export default function msToHMS(ms) {
	var seconds = ms / 1000;
	var hours = parseInt(seconds / 3600); // 3,600 seconds in 1 hour
	var minutes = parseInt(seconds / 60); // 60 seconds in 1 minute
	seconds = seconds % 60;
	return hours + ":" + minutes + ":" + seconds.toFixed(0);
}