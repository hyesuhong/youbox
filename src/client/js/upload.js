const videoFile = document.getElementById('video');
const videoName = document.getElementById('videoFileName');
const videoPreview = document.getElementById('previewVideo');

const thumbFile = document.getElementById('thumbnail');
const thumbName = document.getElementById('thumbFileName');
const thumbPreview = document.getElementById('previewThumb');

const handleVideoSelect = (ev) => {
	const {
		target: { files },
	} = ev;

	const file = files[0];

	if (file) {
		videoName.value = file.name;
		videoPreview.src = URL.createObjectURL(file);
	}
};

const handleThumbSelect = (ev) => {
	const {
		target: { files },
	} = ev;

	const file = files[0];

	if (file) {
		thumbName.value = file.name;
		thumbPreview.src = URL.createObjectURL(file);
	}
};

videoFile.addEventListener('change', handleVideoSelect);
thumbFile.addEventListener('change', handleThumbSelect);
