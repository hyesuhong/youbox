import Video from '../model/videos';
import User from '../model/users';
import Comment from '../model/comment';

export const getHome = async (req, res) => {
	try {
		const videos = await Video.find({})
			.sort({ createdAt: 'desc' })
			.populate('owner');

		return res.render('home', { pageTitle: 'Home', videos });
	} catch (error) {
		console.log(error);
		return res.sendStatus(404);
	}
};

export const getWatch = async (req, res) => {
	const { id } = req.params;

	try {
		const video = await Video.findById(id)
			.populate({
				path: 'owner',
				select: 'name avatarUrl',
			})
			.populate({
				path: 'comments',
				populate: { path: 'owner', select: 'name avatarUrl' },
			});

		if (!video) {
			throw new Error('Cannot found video');
		}

		return res.render('video/watch', {
			pageTitle: video.title,
			video,
		});
	} catch (error) {
		console.log(error.message);
		return res.status(404).render('404', {
			pageTitle: 'Not Found',
			errorMessage: error.message,
		});
	}
};

export const getEdit = async (req, res) => {
	const {
		params: { id },
		session: {
			user: { _id },
		},
	} = req;

	try {
		const video = await Video.findById(id);

		if (!video) {
			throw new Error('cannot found video');
		}

		if (video.owner.toString() !== _id) {
			req.flash('error', 'Not Authorized. This is not your video.');
			return res.status(403).redirect('/');
		}

		return res.render('video/edit', {
			pageTitle: `Edit ${video.title}`,
			video,
		});
	} catch (error) {
		console.log(error.message);
		return res.status(404).render('404', {
			pageTitle: 'Not Found',
			errorMessage: error.message,
		});
	}
};

export const postEdit = async (req, res) => {
	const {
		params: { id },
		session: {
			user: { _id },
		},
	} = req;
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

		if (video.owner.toString() !== _id) {
			req.flash('error', 'Not Authorized. This is not your video.');
			return res.status(403).redirect('/');
		}

		req.flash('success', 'Video updated!');
		return res.redirect(`/videos/${id}`);
	} catch (error) {
		console.log(error.message);
		return res.status(404).render('404', {
			pageTitle: 'Not Found',
			errorMessage: error.message,
		});
	}
};

export const getUpload = (req, res) => {
	return res.render('video/upload', {
		pageTitle: 'Upload new video',
	});
};

export const postUpload = async (req, res) => {
	const {
		session: {
			user: { _id },
		},
		body: { title, description, hashtags },
		files: { video, thumbnail },
	} = req;

	try {
		const newVideo = await Video.create({
			fileUrl: video[0].path,
			thumbUrl: thumbnail[0].path,
			title,
			description,
			hashtags: Video.formatHashtags(hashtags),
			owner: _id,
		});

		const user = await User.findById(_id);
		user.videos.push(newVideo._id);
		user.save();

		req.flash('success', 'Upload video successfully');
		return res.redirect('/');
	} catch (err) {
		const code = err.cause ? err.cause.code : 400;
		const message = err.cause ? err.message : err._message;

		const errorMsg = `${message}(with error code ${code})`;
		req.flash('error', errorMsg);

		return res.status(400).render('video/upload', {
			pageTitle: 'Upload new video',
		});
	}
};

export const getDelete = async (req, res) => {
	const {
		params: { id },
		session: {
			user: { _id },
		},
	} = req;

	try {
		const video = await Video.findById(id);

		if (!video) {
			throw new Error('cannot found video');
		}

		if (video.owner.toString() !== _id) {
			req.flash('error', 'Not Authorized. This is not your video.');
			return res.status(403).redirect('/');
		}

		await Video.findByIdAndDelete(id);
		req.flash('success', 'Video deleted');
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
			const videos = await Video.find({ title: { $regex: title } }).populate(
				'owner'
			); // => mongodb option

			return res.render('search', { pageTitle: 'Search', keyword, videos });
		} catch (error) {
			console.log(error);
		}
	}
	return res.render('search', { pageTitle: 'Search', videos: [] });
};

export const postVideoView = async (req, res) => {
	const {
		params: { id },
	} = req;

	try {
		const video = await Video.findById(id);

		if (!video) {
			throw new Error('cannot found video');
		}

		video.meta.views = video.meta.views + 1;
		await video.save();

		return res.sendStatus(200);
	} catch (error) {
		console.log(error.message);
		return res.sendStatus(404);
	}
};

export const postVideoComment = async (req, res) => {
	const {
		params: { id },
		session: {
			user: { _id },
		},
		body: { text },
	} = req;

	try {
		const video = await Video.findById(id);

		if (!video) {
			throw new Error('cannot found video');
		}

		const comment = await Comment.create({ text, owner: _id, video: id });

		video.comments.push(comment._id);
		video.save();

		const newComment = await Comment.findById(comment._id).populate({
			path: 'owner',
			select: 'name avatarUrl',
		});

		return res.status(201).send({ data: newComment });
	} catch (error) {
		console.log(error.message);
		return res.sendStatus(404);
	}

	return res.end();
};

export const deleteVideoComment = async (req, res) => {
	const {
		params: { id },
		session: {
			user: { _id },
		},
	} = req;

	try {
		const comment = await Comment.findById(id);

		if (!comment) {
			throw new Error('cannot found comment');
		}

		if (comment.owner.toString() !== _id) {
			req.flash('error', 'Not Authorized. This is not your comment.');
			return res.status(403).redirect('/');
		}

		const video = await Video.findById(comment.video._id);

		if (!video) {
			throw new Error('cannot found video');
		}

		const videoComments = video.comments;
		const commentIndex = video.comments.findIndex(
			(cid) => cid.toString() === id
		);

		video.comments = [
			...videoComments.slice(0, commentIndex),
			...videoComments.slice(commentIndex + 1),
		];

		await video.save();
		await Comment.findByIdAndDelete(id);

		res.sendStatus(204);
	} catch (error) {
		console.log(error.message);
		return res.sendStatus(404);
	}

	return res.end();
};
