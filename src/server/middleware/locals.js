import multer from 'multer';

export const localsMiddleware = (req, res, next) => {
	const { loggedIn, user } = req.session;

	res.locals.loggedIn = Boolean(loggedIn);
	res.locals.loggedInUser = user;

	next();
};

export const protectorMiddleware = (req, res, next) => {
	if (!req.session.loggedIn) {
		return res.redirect('/login');
	}

	next();
};

export const publicOnlyMiddleware = (req, res, next) => {
	if (req.session.loggedIn) {
		req.flash('error', 'Not Authorized');
		console.log(res.locals);
		return res.redirect('/');
	}

	next();
};

export const notSocialOnlyMiddleware = (req, res, next) => {
	if (req.session.user.socialOnly) {
		return res.redirect('/');
	}

	next();
};

export const uploadAvatars = multer({
	dest: 'uploads/avatars/',
	limits: {
		fileSize: 3000,
	},
});

export const uploadVideos = multer({
	dest: 'uploads/videos/',
	limits: { fileSize: 30000000 },
});
