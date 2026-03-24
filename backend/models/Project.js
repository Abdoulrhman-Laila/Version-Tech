import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    ar: {
      type: String,
      required: [true, 'Arabic title is required'],
      trim: true
    },
    en: {
      type: String,
      required: [true, 'English title is required'],
      trim: true
    }
  },
  description: {
    ar: {
      type: String,
      required: [true, 'Arabic description is required'],
      maxLength: [1000, 'Description cannot exceed 1000 characters']
    },
    en: {
      type: String,
      required: [true, 'English description is required'],
      maxLength: [1000, 'Description cannot exceed 1000 characters']
    }
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      ar: String,
      en: String
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['website', 'mobile', 'ecommerce', 'corporate', 'other']
  },
  technologies: [{
    type: String,
    trim: true
  }],
  links: {
    live: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: 'Please provide a valid URL'
      }
    },
    github: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/(www\.)?github\.com\/.+/.test(v);
        },
        message: 'Please provide a valid GitHub URL'
      }
    },
    demo: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: 'Please provide a valid demo URL'
      }
    }
  },
  client: {
    name: String,
    website: String,
    logo: String
  },
  duration: {
    type: String,
    trim: true
  },
  teamMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TeamMember'
  }],
  status: {
    type: String,
    enum: ['planning', 'development', 'testing', 'completed', 'maintained'],
    default: 'completed'
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  completedAt: {
    type: Date
  },
  stats: {
    views: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
projectSchema.index({ category: 1 });
projectSchema.index({ featured: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ isPublic: 1 });
projectSchema.index({ order: 1 });
projectSchema.index({ slug: 1 });

// Create slug before saving
projectSchema.pre('save', function(next) {
  if (this.isModified('title.en') || this.isNew) {
    this.slug = this.title.en
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, '-');
  }
  next();
});

// Virtual for primary image
projectSchema.virtual('primaryImage').get(function() {
  return this.images.find(img => img.isPrimary) || this.images[0];
});

// Virtual for project URL
projectSchema.virtual('url').get(function() {
  return `/projects/${this.slug}`;
});

// Static method to get featured projects
projectSchema.statics.getFeatured = function() {
  return this.find({ featured: true, isPublic: true }).sort({ order: 1 });
};

// Static method to get projects by category
projectSchema.statics.getByCategory = function(category) {
  return this.find({ category, isPublic: true }).sort({ order: 1 });
};

// Static method to get public projects
projectSchema.statics.getPublic = function() {
  return this.find({ isPublic: true }).sort({ order: 1 });
};

// Instance method to increment views
projectSchema.methods.incrementViews = function() {
  this.stats.views += 1;
  return this.save();
};

export default mongoose.model('Project', projectSchema);
