const videoContainer = document.getElementById('videoContainer');
const form = document.getElementById('commentForm');
const commentList = document.querySelector('.video__comments-list');
const commentTag = document.querySelector('.videoInfo__meta-comments');

const handleSubmit = async (ev) => {
	ev.preventDefault();

	const textarea = form.querySelector('textarea');
	const video = videoContainer.querySelector('video');

	const text = textarea.value;
	const videoId = video.dataset.id;

	if (text === '') {
		return;
	}

	const sendData = { text };

	try {
		const res = await fetch(`/api/videos/${videoId}/comment`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(sendData),
		});

		if (res.ok) {
			await res.json().then((data) => createFakeComment(data));

			textarea.value = '';
		}
	} catch (error) {
		console.error(error);
	}
};

const createFakeComment = (resData) => {
	const { _id, owner, text } = resData.data;

	const comment = document.createElement('li');
	comment.className = 'video__comment';
	comment.dataset.id = _id;

	const avatar = document.createElement('span');
	avatar.className = 'avatar medium';

	if (owner.avatarUrl) {
		const avatarImg = document.createElement('img');
		const src = owner.avatarUrl.includes('http')
			? owner.avatarUrl
			: `/${owner.avatarUrl}`;
		avatarImg.src = src;

		avatar.appendChild(avatarImg);
	} else {
		const emptyAvatar = document.createElement('i');
		emptyAvatar.className = 'avatar__empty';

		avatar.appendChild(emptyAvatar);
	}

	const div = document.createElement('div');

	const a = document.createElement('a');
	a.href = `/users/${owner._id}`;
	a.innerText = owner.name;

	const commentText = document.createElement('p');
	commentText.innerText = text;

	div.appendChild(a);
	div.appendChild(commentText);

	const deleteBtn = document.createElement('button');
	deleteBtn.className = 'video__comment-delete';
	deleteBtn.innerText = 'delete';
	deleteBtn.addEventListener('click', handleDeleteBtnClick);

	comment.append(avatar);
	comment.append(div);
	comment.append(deleteBtn);

	commentList.prepend(comment);

	commentTag.innerText = createCommentStr(commentList.children.length);
};

form.addEventListener('submit', handleSubmit);

const deleteBtns = document.querySelectorAll('.video__comment-delete');

const handleDeleteBtnClick = async (e) => {
	const {
		target: { parentElement },
	} = e;

	const confirm = window.confirm('Do you want to delete this comment?');

	if (!confirm) {
		return;
	}

	try {
		const res = await fetch(`/api/comments/${parentElement.dataset.id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (res.ok) {
			parentElement.remove();
			commentTag.innerText = createCommentStr(commentList.children.length);
		}
	} catch (error) {
		console.error(error);
	}
};

deleteBtns.forEach((btn) => {
	btn.addEventListener('click', handleDeleteBtnClick);
});

const createCommentStr = (length) => {
	return `${length} ${length < 2 ? 'comment' : 'comments'}`;
};
