const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const shortSchema = new mongoose.Schema({
  videoURL: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    required: false
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  duration: {
    type: Number,
    
  },
  userId: {
    type: String,
    ref: 'User',
    
  },
  userName: {
    type: String,
    required: true
  },
  likesCount: {
    type: Number,
    default: 0
  },
  likes:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'  // Referencing the User model
  }],
  comments: [commentSchema],
  viewsCount: {
    type: Number,
    default: 0
  },
  hashtags: [{
    type: String,
    trim: true
  }],
  location: {
    type: String,
    trim: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  lastModifiedDate: {
    type: Date,
    default: Date.now
  },
  sharesCount: {
    type: Number,
    default: 0
  },
  privacy: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  relatedLinks: [{
    type: String,
    trim: true
  }]
});

// Update `lastModifiedDate` automatically before saving
shortSchema.pre('save', function (next) {
  this.lastModifiedDate = Date.now();
  next();
});

const Short = mongoose.model('Short', shortSchema);

module.exports = Short;
