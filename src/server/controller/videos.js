import { fakeUser } from '../model/users';
import { videos } from '../model/videos';

export const handleHome = (req, res) => {
	return res.render('home', { pageTitle: 'Home', fakeUser, videos });
};

export const handleUpload = (req, res) => res.send('Upload new video');

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

export const handleDelete = (req, res) => res.send('Delete Video');

export const handleSearch = (req, res) => res.send('Search');
