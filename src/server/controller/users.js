import User from '../model/users';

export const getJoin = (req, res) => res.render('Join', { pageTitle: 'Join' });

export const postJoin = async (req, res) => {
	const { email, username, password, name, location } = req.body;
	try {
		await User.create({
			email,
			name,
			username,
			password,
			location,
		});
		return res.redirect('/login');
	} catch (error) {
		console.log(error);
		return res.sendStatus(500);
	}
};

export const handleLogin = (req, res) => res.send('Login');

export const handleLogout = (req, res) => res.send('Logout');

export const handleProfile = (req, res) => res.send('user`s profile view');

export const handleEdit = (req, res) => res.send('Edit User');

export const handleDelete = (req, res) => res.send('Delete User');
