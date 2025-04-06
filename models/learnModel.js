const mongoose = require('mongoose');

const LearnSchema = new mongoose.Schema({
     id: { type: String, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    creator: { type: String, required: true },
    type: { type: String, required: true, enum: ['Video', 'Blog'] },
    image: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String, default: '#' },
    extraImages: { type: [String], validate: v => v.length <= 3 },
    blogText: { type: String },
    publishedDate: { type: Date, default: Date.now },
    videoUrl: { type: String },
    likes: { type: Number, default: 0 },
    likedBy: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] }
  }, { timestamps: true });
  


const Learn = mongoose.model("Learn", LearnSchema);
module.exports = Learn;
