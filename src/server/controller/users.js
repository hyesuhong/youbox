import bcrypt from 'bcrypt';
import User from '../model/users';
import Video from '../model/videos';
import { uploadAvatars } from '../middleware/locals';

const pageInfo = {
	join: { title: 'Join', view: 'user/join' },
	login: { title: 'Login', view: 'user/login' },
	edit: { title: 'Edit Profile', view: 'user/edit' },
	changePassword: { title: 'Change Password', view: 'user/changePassword' },
};

export const getJoin = (req, res) =>
	res.render(pageInfo.join.view, { pageTitle: pageInfo.join.title });

export const postJoin = async (req, res) => {
	const { email, username, password, passwordConfirm, name, location } =
		req.body;

	if (password !== passwordConfirm) {
		throw new Error('Password confirmation does not match.', {
			cause: { code: 400 },
		});
	}

	try {
		const userExists = await User.exists({
			$or: [{ username }, { email }],
		});

		if (userExists) {
			throw new Error('This username or email is already taken.', {
				cause: { code: 400 },
			});
		}

		await User.create({
			email,
			name,
			username,
			password,
			location,
		});

		req.flash('success', `Join successfuly. Let's log-in our site!`);
		return res.redirect('/login');
	} catch (error) {
		console.log(error);
		const code = error.cause ? error.cause.code : 400;
		const message = error.cause ? error.message : error._message;

		const errorMsg = `${message}(with error code ${code})`;
		req.flash('error', errorMsg);
		return res.status(code).render(pageInfo.join.view, {
			pageTitle: pageInfo.join.title,
		});
	}
};

export const getLogin = (req, res) =>
	res.render(pageInfo.login.view, { pageTitle: pageInfo.login.title });

export const postLogin = async (req, res) => {
	const { username, password } = req.body;

	try {
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

		const errorMsg = `${message}(with error code ${code})`;
		req.flash('error', errorMsg);

		return res.status(code).render(pageInfo.login.view, {
			pageTitle: pageInfo.login.title,
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
				req.flash('error', 'Cannot find github email. Please try again');
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
					avatarUrl: userData.avatar_url,
				});
			}

			return login(user, req, res);
		} else {
			req.flash(
				'error',
				'Elready joined user using your email. Please log-in email ans password.'
			);
			return res.status(400).redirect('/login');
		}
	} catch (error) {
		console.error(error);
	}
};

const login = (user, req, res) => {
	const { password, __v, ...userInfo } = user._doc;

	req.session.loggedIn = true;
	req.session.user = userInfo;

	req.flash('info', 'Welcome!');
	return res.redirect('/');
};

export const getLogout = (req, res) => {
	req.session.destroy();
	return res.redirect('/');
};

export const getEdit = (req, res) => {
	return res.render(pageInfo.edit.view, { pageTitle: pageInfo.edit.title });
};

export const postEdit = async (err, req, res, next) => {
	const {
		session: {
			user: { _id, email: sessionEmail, username: sessionUsername, avatarUrl },
		},
		body: { name, email, username, location },
		file,
	} = req;

	try {
		if (err) {
			throw err;
		}

		if (username !== sessionUsername || email !== sessionEmail) {
			const isExists = await User.exists({
				$or: [{ username }, { email }],
				$and: [{ _id: { $ne: _id } }],
			});

			if (isExists) {
				throw new Error('Aleady taken username or email', {
					cause: { code: 400 },
				});
			}
		}

		const updatedUser = await User.findByIdAndUpdate(
			_id,
			{
				name,
				email,
				username,
				location,
				avatarUrl: file ? file.path : avatarUrl ? avatarUrl : '',
			},
			{ new: true }
		);

		const { password, __v, ...userInfo } = updatedUser._doc;
		req.session.user = userInfo;

		req.flash('success', 'Update your information!');
		return res.redirect('/users/edit');
	} catch (error) {
		const code = error.cause ? error.cause.code : 400;
		const message = error.message ? error.message : error._message;

		const errorMsg = `${message}(with error code ${code})`;
		req.flash('error', errorMsg);

		return res.status(code).render(pageInfo.edit.view, {
			pageTitle: pageInfo.edit.title,
		});
	}
};

export const postUploadAvatar = (req, res, next) => {
	const upload = uploadAvatars.single('avatar');

	upload(req, res, (error) => {
		if (error) {
			next(error);
		}
		// console.log('Error');
		// console.log(error);

		// console.log('Data');
		// console.log(data);
		// return error ? next(error) : res.send();
	});
};

export const getChangePassword = (req, res) => {
	return res.render(pageInfo.changePassword.view, {
		pageTitle: pageInfo.changePassword.title,
	});
};

export const postChangePassword = async (req, res) => {
	const {
		session: {
			user: { _id },
		},
		body: { originPassword, newPassword, newPasswordConfirm },
	} = req;

	try {
		const user = await User.findById(_id);

		if (!user) {
			throw new Error('An account with this username does not exists.', {
				cause: { code: 400 },
			});
		}

		const checkPass = await bcrypt.compare(originPassword, user.password);

		if (!checkPass) {
			throw new Error('Origin password dose not match.', {
				cause: { code: 400 },
			});
		}

		if (newPassword !== newPasswordConfirm) {
			throw new Error('Password confirmation does not match.', {
				cause: { code: 400 },
			});
		}

		user.password = newPassword;
		await user.save();

		req.flash(
			'info',
			'Password updated. Please log-in again with changed password.'
		);
		return res.redirect('/logout');
	} catch (error) {
		const code = error.cause ? error.cause.code : 400;
		const message = error.cause ? error.message : error._message;

		const errorMsg = `${message}(with error code ${code})`;
		req.flash('error', errorMsg);

		return res.status(code).render(pageInfo.changePassword.view, {
			pageTitle: pageInfo.changePassword.title,
		});
	}
};

export const getProfile = async (req, res) => {
	const { id } = req.params;

	try {
		const user = await User.findById(id).populate({
			path: 'videos',
			populate: {
				path: 'owner',
				model: 'User',
			},
		});

		if (!user) {
			throw new Error('There is no user');
		}

		return res.render('user/profile', {
			pageTitle: user.name,
			user,
		});
	} catch (error) {
		return res.status(404).render('404', {
			pageTitle: 'Not Found',
			errorMessage: error.message,
		});
	}
};

export const handleDelete = (req, res) => res.send('Delete User');
