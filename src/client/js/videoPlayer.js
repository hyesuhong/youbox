const video = document.querySelector('video');
const playBtn = document.getElementById('play');
const muteBtn = document.getElementById('mute');
const currentTime = document.getElementById('currentTime');
const totalTime = document.getElementById('totalTime');
const volumeRange = document.getElementById('volume');
const timelineRange = document.getElementById('timeline');
const fullscreenBtn = document.getElementById('fullscreen');
const videoContainer = document.getElementById('videoContainer');
const videoControls = document.getElementById('videoControls');

const DEFAULT_VOLUME = 0.5;

video.volume = DEFAULT_VOLUME;

const handlePlayClick = (e) => {
	if (video.paused) {
		video.play();
		playBtn.classList.add('pause');
	} else {
		video.pause();
		playBtn.classList.remove('pause');
	}
};

const handleMute = (e) => {
	if (video.muted) {
		video.muted = false;
		muteBtn.classList.remove('volume');
	} else {
		video.muted = true;
		muteBtn.classList.add('volume');
	}
	volumeRange.value = video.muted ? 0 : DEFAULT_VOLUME;
};

const handleVolume = (e) => {
	const { value } = e.target;

	video.volume = value;
};

const formatTime = (seconds) => {
	return new Date(seconds * 1000).toISOString().substring(14, 19);
};

const handleLoadedMetadata = (e) => {
	const {
		target: { duration },
	} = e;
	const time = Math.round(duration);
	totalTime.innerText = formatTime(time);
	timelineRange.max = time;
};

const handleTimeUpdate = (e) => {
	const {
		target: { currentTime: seconds },
	} = e;
	const time = Math.round(seconds);
	currentTime.innerText = formatTime(time);
	timelineRange.value = time;
};

const handleTimeline = (e) => {
	const {
		target: { value },
	} = e;
	video.currentTime = value;
};

const handleVideoEnded = (e) => {
	playBtn.classList.remove('pause');
};

const handleFullscreenClick = () => {
	if (document.fullscreenElement) {
		document.exitFullscreen();
		fullscreenBtn.classList.remove('exit');
	} else {
		videoContainer.requestFullscreen();
		fullscreenBtn.classList.add('exit');
	}
};

let controlsTimeout = null;
let controlsMovementTimeout = null;
const hideControls = () => videoControls.classList.remove('showing');

const handleMouseMove = () => {
	if (controlsTimeout) {
		clearTimeout(controlsTimeout);
		controlsTimeout = null;
	}

	if (controlsMovementTimeout) {
		clearTimeout(controlsMovementTimeout);
		controlsMovementTimeout = null;
	}

	videoControls.classList.add('showing');

	controlsMovementTimeout = setTimeout(hideControls, 3000);
};

const handleMouseLeave = () => {
	controlsTimeout = setTimeout(hideControls, 3000);
};

playBtn.addEventListener('click', handlePlayClick);
muteBtn.addEventListener('click', handleMute);
volumeRange.addEventListener('input', handleVolume);
timelineRange.addEventListener('input', handleTimeline);
video.addEventListener('loadedmetadata', handleLoadedMetadata);
video.addEventListener('timeupdate', handleTimeUpdate);
video.addEventListener('ended', handleVideoEnded);
fullscreenBtn.addEventListener('click', handleFullscreenClick);
video.addEventListener('mousemove', handleMouseMove);
video.addEventListener('mouseleave', handleMouseLeave);
