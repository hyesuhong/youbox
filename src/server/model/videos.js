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
	fileUrl: { type: String, required: true },
	thumbUrl: { type: String, required: true },
	owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
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

const Video = mongoose.model('Video', videoSchema);

export default Video;
