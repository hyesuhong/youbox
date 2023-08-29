const videoContainer = document.getElementById('videoContainer');
const videoControls = document.getElementById('videoControls');

const video = document.querySelector('video');

const playBtn = document.getElementById('play');
const muteBtn = document.getElementById('mute');
const fullscreenBtn = document.getElementById('fullscreen');

const currentTime = document.getElementById('currentTime');
const totalTime = document.getElementById('totalTime');

const volumeRange = document.getElementById('volume');
const timelineRange = document.getElementById('timeline');

const DEFAULT_VOLUME = 0.5;

video.volume = DEFAULT_VOLUME;

const setVideoPlayState = (isPaused) => {
	if (isPaused) {
		video.play();
	} else {
		video.pause();
	}
};

const setVideoVolumeState = (isMuted) => {
	video.muted = !isMuted;
};

const setVideoVolumeValue = (value) => {
	video.volume = value;
	if (value !== 0 && video.muted) {
		video.muted = false;
	}
};

const setFullscreenState = (fullscreenEl) => {
	if (fullscreenEl) {
		document.exitFullscreen();
	} else {
		videoContainer.requestFullscreen();
	}
};

const formatTime = (seconds) =>
	new Date(seconds * 1000).toISOString().substring(14, 19);

const getFloorSeconds = (seconds) => Math.floor(seconds);

const clickPlayBtn = (e) => setVideoPlayState(video.paused);

const clickMuteBtn = (e) => {
	setVideoVolumeState(video.muted);
	volumeRange.value = video.muted ? 0 : DEFAULT_VOLUME;
};

const changeVoulmeRange = (e) => {
	const { value } = e.target;
	setVideoVolumeValue(value);
};

const changeTimelineRange = (e) => {
	const {
		target: { value },
	} = e;
	video.currentTime = value;
};

const clickFullscreenBtn = () => {
	setFullscreenState(document.fullscreenElement);
};

playBtn.addEventListener('click', clickPlayBtn);
muteBtn.addEventListener('click', clickMuteBtn);
volumeRange.addEventListener('input', changeVoulmeRange);
timelineRange.addEventListener('input', changeTimelineRange);
fullscreenBtn.addEventListener('click', clickFullscreenBtn);

const handleLoadedMetadata = (e) => {
	const {
		target: { duration },
	} = e;
	const time = getFloorSeconds(duration);
	totalTime.innerText = formatTime(time);
	timelineRange.max = time;
};

const handleTimeUpdate = (e) => {
	const {
		target: { currentTime: seconds },
	} = e;
	const time = getFloorSeconds(seconds);
	currentTime.innerText = formatTime(time);
	timelineRange.value = time;
};

const handleVideoEnded = async (e) => {
	playBtn.classList.remove('pause');

	const { id } = video.dataset;

	await fetch(`/api/videos/${id}/view`, { method: 'POST' }).catch(
		console.error
	);
};

const clickVideoToPlayStop = () => {
	if (video.paused) {
		video.play();
		playBtn.classList.add('pause');
	} else {
		video.pause();
		playBtn.classList.remove('pause');
	}
};

const handleChanageVideoVolume = (e) => {
	const {
		target: { volume, muted },
	} = e;
	if (volume === 0 || muted) {
		muteBtn.classList.contains('volume') && muteBtn.classList.remove('volume');
	} else {
		!muteBtn.classList.contains('volume') && muteBtn.classList.add('volume');
	}
};

video.addEventListener('loadedmetadata', handleLoadedMetadata);
video.addEventListener('timeupdate', handleTimeUpdate);
video.addEventListener('ended', handleVideoEnded);
video.addEventListener('click', clickVideoToPlayStop);
video.addEventListener('pause', () => playBtn.classList.remove('pause'));
video.addEventListener('play', () => playBtn.classList.add('pause'));
video.addEventListener('volumechange', handleChanageVideoVolume);

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

const handleFullscreenChange = () => {
	if (document.fullscreenElement) {
		fullscreenBtn.classList.add('exit');
	} else {
		fullscreenBtn.classList.remove('exit');
	}
};

videoContainer.addEventListener('mousemove', handleMouseMove);
videoContainer.addEventListener('mouseleave', handleMouseLeave);
videoContainer.addEventListener('fullscreenchange', handleFullscreenChange);

const handleKeyDown = (e) => {
	e.preventDefault();
	const { code } = e;

	if (code === 'Space') {
		playBtn.click();
		return;
	}
};

document.addEventListener('keydown', handleKeyDown);
