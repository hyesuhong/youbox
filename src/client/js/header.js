const headerAvatar = document.querySelector('.header__avatar');

if (headerAvatar) {
	headerAvatar.addEventListener('click', (ev) => {
		const parentEl = ev.currentTarget.parentElement;

		if (parentEl.classList.contains('active')) {
			parentEl.classList.remove('active');
		} else {
			parentEl.classList.add('active');
		}
	});
}
