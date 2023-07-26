import { fakeUser } from '../model/users';
import Video from '../model/videos';

export const getHome = async (req, res) => {
	try {
		const videos = await Video.find({});
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

export const postUpload = async (req, res) => {
	const { title, description, hashtags } = req.body;

	const video = new Video({
		title,
		description,
		hashtags: hashtags
			.replace(/\s/gi, '')
			.split(',')
			.filter((el) => el !== ''),
	});

	try {
		await video.save();
		return res.redirect('/');
	} catch (err) {
		console.log(err);
		return res.render('video/upload', {
			pageTitle: 'Upload new video',
			fakeUser,
			errorMessage: err._message,
		});
	}
};
