import User from '../model/users';

const pageTitle = {
	join: 'Join',
};

export const getJoin = (req, res) =>
	res.render('Join', { pageTitle: pageTitle.join });

export const postJoin = async (req, res) => {
	const { email, username, password, passwordConfirm, name, location } =
		req.body;

	if (password !== passwordConfirm) {
		return res.status(400).render('Join', {
			pageTitle: pageTitle.join,
			errorMessage: 'Password confirmation does not match.',
		});
	}

	try {
		const userExists = await User.exists({
			$or: [{ username }, { email }],
		});

		if (userExists) {
			return res.status(400).render('Join', {
				pageTitle: pageTitle.join,
				errorMessage: 'This username or email is already taken.',
			});
		}

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
		return res.status(400).render('Join', {
			pageTitle: pageTitle.join,
			errorMessage: error._message,
		});
	}
};

export const handleLogin = (req, res) => res.send('Login');

export const handleLogout = (req, res) => res.send('Logout');

export const handleProfile = (req, res) => res.send('user`s profile view');

export const handleEdit = (req, res) => res.send('Edit User');

export const handleDelete = (req, res) => res.send('Delete User');
