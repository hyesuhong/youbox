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
		// const user = await User.findOne({ username,socialOnly:false });
		const user = await User.findOne({
			$or: [
				{ username, socialOnly: { $exists: false } },
				{ username, socialOnly: false },
			],
		});

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

		return login(user, req, res);
	} catch (error) {
		const code = error.cause ? error.cause.code : 400;
		const message = error.cause ? error.message : error._message;

		return res.status(code).render(pageInfo.login.view, {
			pageTitle: pageInfo.login.title,
			errorMessage: message,
		});
	}
};

export const startGithubLogin = (req, res) => {
	const baseURL = 'https://github.com/login/oauth/authorize';
	const config = {
		client_id: process.env.GH_CLIENT,
		allow_signup: false,
		scope: 'read:user user:email',
	};
	const params = new URLSearchParams(config).toString();
	const targetURL = `${baseURL}?${params}`;

	return res.redirect(targetURL);
};

export const finishGithubLogin = async (req, res) => {
	const { code } = req.query;
	const baseURL = 'https://github.com/login/oauth/access_token';
	const config = {
		client_id: process.env.GH_CLIENT,
		client_secret: process.env.GH_SECRET,
		code,
	};
	const params = new URLSearchParams(config).toString();
	const targetURL = `${baseURL}?${params}`;

	try {
		const tokenReq = await (
			await fetch(targetURL, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
				},
			})
		).json();

		if (tokenReq.access_token) {
			const { access_token } = tokenReq;
			const apiURL = 'https://api.github.com/user';
			const userData = await (
				await fetch(apiURL, {
					headers: {
						Authorization: `Bearer ${access_token}`,
					},
				})
			).json();

			const emailData = await (
				await fetch(`${apiURL}/emails`, {
					headers: {
						Authorization: `Bearer ${access_token}`,
					},
				})
			).json();

			const githubEmail = emailData.find((em) => em.primary && em.verified);

			if (!githubEmail) {
				return res.status(400).redirect('/login');
			}

			let user = await User.findOne({ email: githubEmail.email });

			if (!user) {
				user = await User.create({
					email: githubEmail.email,
					name: userData.name,
					username: userData.login,
					password: '',
					location: userData.location,
					socialOnly: true,
				});
			}

			return login(user, req, res);
		} else {
			return res.status(400).redirect('/login');
		}
	} catch (error) {
		console.error(error);
	}
};

const login = (user, req, res) => {
	req.session.loggedIn = true;
	req.session.user = {
		_id: user._id,
		email: user.email,
		username: user.username,
		name: user.name,
		location: user.location,
	};

	return res.redirect('/');
};

export const getLogout = (req, res) => {
	req.session.destroy();
	return res.redirect('/');
};

export const handleProfile = (req, res) => res.send('user`s profile view');

export const handleEdit = (req, res) => res.send('Edit User');

export const handleDelete = (req, res) => res.send('Delete User');
