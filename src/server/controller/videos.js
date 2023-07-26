import { fakeUser } from '../model/users';
import Video from '../model/videos';

export const getHome = async (req, res) => {
	try {
		const videos = await Video.find({}).sort({ createdAt: 'desc' });

		return res.render('home', { pageTitle: 'Home', fakeUser, videos });
	} catch (error) {
		console.log(error);
		return res.sendStatus(404);
	}
};

export const getWatch = async (req, res) => {
	const { id } = req.params;

	try {
		const video = await Video.findById(id);

		if (!video) {
			throw new Error('cannot found video');
		}

		return res.render('video/watch', {
			pageTitle: video.title,
			fakeUser,
			video,
		});
	} catch (error) {
		console.log(error.message);
		return res.render('404', {
			pageTitle: 'Not Found',
			errorMessage: error.message,
			fakeUser,
		});
	}
};

export const getEdit = async (req, res) => {
	const { id } = req.params;

	try {
		const video = await Video.findById(id);

		if (!video) {
			throw new Error('cannot found video');
		}

		return res.render('video/edit', {
			pageTitle: `Edit ${video.title}`,
			fakeUser,
			video,
		});
	} catch (error) {
		console.log(error.message);
		return res.render('404', {
			pageTitle: 'Not Found',
			errorMessage: error.message,
			fakeUser,
		});
	}
};

export const postEdit = async (req, res) => {
	const { id } = req.params;
	const { title, description, hashtags } = req.body;

	const isExist = Video.exists({ _id: id });

	if (!isExist) {
		throw new Error('cannot found video');
	}

	try {
		const video = await Video.findByIdAndUpdate(id, {
			title,
			description,
			hashtags: Video.formatHashtags(hashtags),
		});

		return res.redirect(`/videos/${id}`);
	} catch (error) {
		console.log(error.message);
		return res.render('404', {
			pageTitle: 'Not Found',
			errorMessage: error.message,
			fakeUser,
		});
	}
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
		hashtags: Video.formatHashtags(hashtags),
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

export const deleteVideo = async (req, res) => {
	const { id } = req.params;

	try {
		await Video.findByIdAndDelete(id);
		return res.redirect('/');
	} catch (error) {
		console.log(error);
		return res.sendStatus(500);
	}
};

export const getSearch = async (req, res) => {
	const { keyword } = req.query;
	if (keyword) {
		const title = new RegExp(keyword, 'i');

		try {
			// const videos = await Video.find({ title: title }); // => moongose option
			const videos = await Video.find({ title: { $regex: title } }); // => mongodb option
			console.log(videos);

			return res.render('search', { pageTitle: 'Search', fakeUser, videos });
		} catch (error) {
			console.log(error);
		}
	}
	return res.render('search', { pageTitle: 'Search', fakeUser });
};