const fakeUser = {
	username: 'ssu',
	loggedIn: false,
};

export const handleHome = (req, res) => {
	const videos = new Array(3).fill(0).map((el, index) => {
		return {
			id: index,
			title: `Title ${index}`,
			rating: Math.floor(Math.random() * 5),
			comments: Math.floor(Math.random() * 100),
			createdAt: `${Math.floor(Math.random() * 59)} minutes ago`,
			views: Math.floor(Math.random() * 100),
		};
	});
	// const videos = []
	return res.render('home', { pageTitle: 'Home', fakeUser, videos });
};

export const handleUpload = (req, res) => res.send('Upload new video');

export const handleWatch = (req, res) =>
	res.render('watch', { pageTitle: 'Watch', fakeUser });
// res.send(`Watch Video(id: ${req.params.id})`);

export const handleEdit = (req, res) => {
	// console.log(req.params);
	return res.send(`Edit Video(id: ${req.params.id})`);
};

export const handleDelete = (req, res) => res.send('Delete Video');

export const handleSearch = (req, res) => res.send('Search');

export const handleComments = (req, res) => res.send('Get comments');

export const handleDeleteComments = (req, res) => res.send('Delete comment');
