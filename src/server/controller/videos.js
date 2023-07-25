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
		return res.send(404);
	}

	return res.render('watch', { pageTitle: 'Watch', fakeUser, video });
};
// res.send(`Watch Video(id: ${req.params.id})`);

export const handleEdit = (req, res) => {
	// console.log(req.params);
	return res.send(`Edit Video(id: ${req.params.id})`);
};

export const handleDelete = (req, res) => res.send('Delete Video');

export const handleSearch = (req, res) => res.send('Search');

export const handleComments = (req, res) => res.send('Get comments');

export const handleDeleteComments = (req, res) => res.send('Delete comment');
