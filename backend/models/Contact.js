import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxLength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  phone: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^[+]?[\d\s\-\(\)]{7,15}$/.test(v);
      },
      message: 'Please provide a valid phone number'
    }
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxLength: [200, 'Subject cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxLength: [2000, 'Message cannot exceed 2000 characters']
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'archived'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  category: {
    type: String,
    enum: ['general', 'project', 'support', 'partnership', 'career'],
    default: 'general'
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  readAt: {
    type: Date
  },
  repliedAt: {
    type: Date
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: [{
    note: {
      type: String,
      required: true
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isSpam: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
contactSchema.index({ status: 1 });
contactSchema.index({ priority: 1 });
contactSchema.index({ category: 1 });
contactSchema.index({ email: 1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ isSpam: 1 });

// Virtual for time since message
contactSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diff = now - this.createdAt;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} days ago`;
  if (hours > 0) return `${hours} hours ago`;
  if (minutes > 0) return `${minutes} minutes ago`;
  return 'Just now';
});

// Instance method to mark as read
contactSchema.methods.markAsRead = function(userId) {
  this.status = 'read';
  this.readAt = new Date();
  if (userId) {
    this.assignedTo = userId;
  }
  return this.save();
};

// Instance method to mark as replied
contactSchema.methods.markAsReplied = function() {
  this.status = 'replied';
  this.repliedAt = new Date();
  return this.save();
};

// Instance method to add note
contactSchema.methods.addNote = function(note, userId) {
  this.notes.push({
    note,
    addedBy: userId
  });
  return this.save();
};

// Static method to get unread messages
contactSchema.statics.getUnread = function() {
  return this.find({ status: 'new', isSpam: false }).sort({ createdAt: -1 });
};

// Static method to get high priority messages
contactSchema.statics.getHighPriority = function() {
  return this.find({ 
    priority: { $in: ['high', 'urgent'] }, 
    status: { $in: ['new', 'read'] },
    isSpam: false 
  }).sort({ priority: -1, createdAt: -1 });
};

// Static method for basic spam detection
contactSchema.statics.detectSpam = function(message, email) {
  const spamKeywords = ['viagra', 'casino', 'lottery', 'winner', 'congratulations', 'million dollars'];
  const messageText = message.toLowerCase();
  
  // Check for spam keywords
  const hasSpamKeywords = spamKeywords.some(keyword => messageText.includes(keyword));
  
  // Check for suspicious patterns
  const hasSuspiciousPattern = /(.)\1{4,}/.test(messageText) || // Repeated characters
                               messageText.length < 10 || // Too short
                               /http[s]?:\/\//.test(messageText); // Contains URLs
  
  return hasSpamKeywords || hasSuspiciousPattern;
};

export default mongoose.model('Contact', contactSchema);
