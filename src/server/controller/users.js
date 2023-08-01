import bcrypt from 'bcrypt';
import User from '../model/users';

const pageInfo = {
	join: { title: 'Join', view: 'user/join' },
	login: { title: 'Login', view: 'user/login' },
};

export const getJoin = (req, res) =>
	res.render(pageInfo.join.view, { pageTitle: pageInfo.join.title });

export const postJoin = async (req, res) => {
	const { email, username, password, passwordConfirm, name, location } =
		req.body;

	if (password !== passwordConfirm) {
		return res.status(400).render(pageInfo.join.view, {
			pageTitle: pageInfo.join.title,
			errorMessage: 'Password confirmation does not match.',
		});
	}

	try {
		const userExists = await User.exists({
			$or: [{ username }, { email }],
		});

		if (userExists) {
			return res.status(400).render(pageInfo.join.view, {
				pageTitle: pageInfo.join.title,
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
		return res.status(400).render(pageInfo.join.view, {
			pageTitle: pageInfo.join.title,
			errorMessage: error._message,
		});
	}
};

export const getLogin = (req, res) =>
	res.render(pageInfo.login.view, { pageTitle: pageInfo.login.title });

export const postLogin = async (req, res) => {
	const { username, password } = req.body;

	try {
		const user = await User.findOne({ username });

		if (!user) {
			throw new Error('An account with this username does not exists.', {
				cause: { code: 400 },
			});
		}

		const checkPass = await bcrypt.compare(password, user.password);

		if (!checkPass) {
			throw new Error('Wrong password', {
				cause: { code: 400 },
			});
		}

		// storage user using session/cookies

		return res.redirect('/');
	} catch (error) {
		const code = error.cause ? error.cause.code : 400;
		const message = error.cause ? error.message : error._message;

		return res.status(code).render(pageInfo.login.view, {
			pageTitle: pageInfo.login.title,
			errorMessage: message,
		});
	}
};

export const handleLogout = (req, res) => res.send('Logout');

export const handleProfile = (req, res) => res.send('user`s profile view');

export const handleEdit = (req, res) => res.send('Edit User');

export const handleDelete = (req, res) => res.send('Delete User');
