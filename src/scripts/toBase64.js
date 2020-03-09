export const toBase64 = file =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			downscaleImage(reader.result, "image/jpeg", 800, 0.7).then(result => resolve(result));
		};
		reader.onerror = error => reject(error);
	});

function getImage(dataUrl) {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.src = dataUrl;
		image.onload = () => {
			resolve(image);
		};
		image.onerror = err => {
			reject(err.error);
		};
	});
}

async function downscaleImage(dataUrl, imageType, resolution) {
	// Create a temporary image so that we can compute the height of the image.
	const image = await getImage(dataUrl);
	const oldWidth = image.naturalWidth;
	const oldHeight = image.naturalHeight;
	console.log("dims", oldWidth, oldHeight);

	const longestDimension = oldWidth > oldHeight ? "width" : "height";
	const currentRes = longestDimension == "width" ? oldWidth : oldHeight;
	console.log("longest dim", longestDimension, currentRes);

	// Calculate new dimensions
	const newSize = longestDimension == "width" ? Math.floor((oldHeight / oldWidth) * resolution) : Math.floor((oldWidth / oldHeight) * resolution);
	const newWidth = longestDimension == "width" ? resolution : newSize;
	const newHeight = longestDimension == "height" ? resolution : newSize;
	console.log("new width / height", newWidth, newHeight);

	// Create a temporary canvas to draw the downscaled image on.
	const canvas = document.createElement("canvas");
	canvas.width = newWidth;
	canvas.height = newHeight;

	// Draw the downscaled image on the canvas and return the new data URL.
	const ctx = canvas.getContext("2d");
	ctx.drawImage(image, 0, 0, newWidth, newHeight);
	const newDataUrl = canvas.toDataURL("image/jpeg", 0.7);
	return newDataUrl;
}
