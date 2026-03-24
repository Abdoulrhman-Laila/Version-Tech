import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
  name: {
    ar: {
      type: String,
      required: [true, 'Arabic name is required'],
      trim: true
    },
    en: {
      type: String,
      required: [true, 'English name is required'],
      trim: true
    }
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: ['fullstack', 'frontend', 'backend', 'ui', 'ux', 'manager', 'designer']
  },
  bio: {
    ar: {
      type: String,
      required: [true, 'Arabic bio is required'],
      maxLength: [500, 'Bio cannot exceed 500 characters']
    },
    en: {
      type: String,
      required: [true, 'English bio is required'],
      maxLength: [500, 'Bio cannot exceed 500 characters']
    }
  },
  image: {
    type: String,
    default: 'default-avatar.jpg'
  },
  skills: [{
    type: String,
    trim: true
  }],
  social: {
    github: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/(www\.)?github\.com\/.+/.test(v);
        },
        message: 'Please provide a valid GitHub URL'
      }
    },
    linkedin: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/(www\.)?linkedin\.com\/.+/.test(v);
        },
        message: 'Please provide a valid LinkedIn URL'
      }
    },
    twitter: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/(www\.)?twitter\.com\/.+/.test(v);
        },
        message: 'Please provide a valid Twitter URL'
      }
    },
    dribbble: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/(www\.)?dribbble\.com\/.+/.test(v);
        },
        message: 'Please provide a valid Dribbble URL'
      }
    },
    behance: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/(www\.)?behance\.net\/.+/.test(v);
        },
        message: 'Please provide a valid Behance URL'
      }
    }
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
teamMemberSchema.index({ role: 1 });
teamMemberSchema.index({ order: 1 });
teamMemberSchema.index({ isActive: 1 });

// Virtual for full social links
teamMemberSchema.virtual('socialLinks').get(function() {
  const links = [];
  Object.entries(this.social).forEach(([platform, url]) => {
    if (url) {
      links.push({ platform, url });
    }
  });
  return links;
});

// Static method to get team members by role
teamMemberSchema.statics.getByRole = function(role) {
  return this.find({ role, isActive: true }).sort({ order: 1 });
};

// Static method to get active team members
teamMemberSchema.statics.getActiveMembers = function() {
  return this.find({ isActive: true }).sort({ order: 1 });
};
export default mongoose.model('TeamMember', teamMemberSchema);
