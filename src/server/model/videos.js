import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
	title: { type: String, required: true, trim: true, maxLength: 80 },
	description: { type: String, required: true, trim: true, minLength: 20 },
	createdAt: { type: Date, required: true, default: Date.now },
	hashtags: [{ type: String, trim: true }],
	meta: {
		views: { type: Number, default: 0, required: true },
		rating: { type: Number, default: 0, required: true },
	},
});

videoSchema.static('formatHashtags', function (hashtags) {
	return hashtags
		.replace(/\s/gi, '')
		.split(',')
		.filter((el) => el !== '');
});

// videoSchema.pre('save', async function () {
// 	console.log('We are about to save:', this);
// 	this.hashtags = await splitTags(this.hashtags);
// });

// const splitTags = (tags) => {
// 	return tags[0]
// 		.replace(/\s/gi, '')
// 		.split(',')
// 		.filter((el) => el !== '');
// };

const Video = mongoose.model('Video', videoSchema);

export default Video;