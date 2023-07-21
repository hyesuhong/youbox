export const handleHome = (req, res) => res.send('Home');

export const handleUpload = (req, res) => res.send('Upload new video');

export const handleWatch = (req, res) =>
	res.send(`Watch Video(id: ${req.params.id})`);

export const handleEdit = (req, res) => {
	// console.log(req.params);
	return res.send(`Edit Video(id: ${req.params.id})`);
};

export const handleDelete = (req, res) => res.send('Delete Video');

export const handleSearch = (req, res) => res.send('Search');

export const handleComments = (req, res) => res.send('Get comments');

export const handleDeleteComments = (req, res) => res.send('Delete comment');
