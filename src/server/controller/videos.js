import { fakeUser } from '../model/users';
import videoModel from '../model/videos';

export const getHome = async (req, res) => {
	try {
		const videos = await videoModel.find({});
		console.log(videos);
		return res.render('home', { pageTitle: 'Home', fakeUser, videos });
	} catch (error) {
		console.log(error);
		return res.sendStatus(404);
	}
};

export const handleWatch = (req, res) => {
	const { id } = req.params;
	const video = videos.find((el) => el.id === Number(id));

	if (!video) {
		return res.sendStatus(404);
	}

	return res.render('video/watch', {
		pageTitle: `Watching ${video.title}`,
		fakeUser,
		video,
	});
};

export const getEdit = (req, res) => {
	const { id } = req.params;
	const video = videos.find((el) => el.id === Number(id));

	if (!video) {
		return res.sendStatus(404);
	}

	return res.render('video/edit', {
		pageTitle: `Edit ${video.title}`,
		fakeUser,
		video,
	});
};

export const postEdit = (req, res) => {
	const { id } = req.params;
	const { title } = req.body;
	const videoIndex = videos.findIndex((el) => el.id === Number(id));

	if (videoIndex < 0) {
		return res.sendStatus(404);
	}

	videos[videoIndex].title = title;

	return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
	return res.render('video/upload', {
		pageTitle: 'Upload new video',
		fakeUser,
	});
};

export const postUpload = (req, res) => {
	const { title } = req.body;

	const video = {
		id: videos.length + 1,
		title: title,
		rating: 0,
		comments: 0,
		createdAt: 'just now',
		views: 0,
	};

	videos.push(video);
	return res.redirect('/');
};
