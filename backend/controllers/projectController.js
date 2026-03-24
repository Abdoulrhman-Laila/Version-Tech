import Project from '../models/Project.js';
import { validationResult } from 'express-validator';

// Helper function to handle validation errors
const handleValidationErrors = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    throw new Error(errorMessages.join('. '));
  }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res) => {
  try {
    const { category, featured, status, limit, page, sort } = req.query;
    let query = {};

    // For public access, only show public projects
    if (!req.user || req.user.role !== 'admin') {
      query.isPublic = true;
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by featured
    if (featured !== undefined) {
      query.featured = featured === 'true';
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    let sortOption = { order: 1, createdAt: -1 };
    if (sort) {
      switch (sort) {
        case 'newest':
          sortOption = { createdAt: -1 };
          break;
        case 'oldest':
          sortOption = { createdAt: 1 };
          break;
        case 'order':
          sortOption = { order: 1, createdAt: -1 };
          break;
        case 'views':
          sortOption = { 'stats.views': -1 };
          break;
        default:
          sortOption = { order: 1, createdAt: -1 };
      }
    }

    const projects = await Project.find(query)
      .populate('teamMembers', 'name role image')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    const total = await Project.countDocuments(query);

    res.status(200).json({
      success: true,
      count: projects.length,
      total,
      pages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: projects
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
export const getProject = async (req, res) => {
  try {
    let project;

    // Check if the ID is a MongoDB ObjectId or a slug
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      project = await Project.findById(req.params.id).populate('teamMembers', 'name role image');
    } else {
      project = await Project.findOne({ slug: req.params.id }).populate('teamMembers', 'name role image');
    }

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if project is public (for non-admin users)
    if (!project.isPublic && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Increment views for public access
    if (!req.user || req.user.role !== 'admin') {
      await project.incrementViews();
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private/Admin
export const createProject = async (req, res) => {
  try {
    handleValidationErrors(req);

    const project = await Project.create(req.body);

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
export const updateProject = async (req, res) => {
  try {
    handleValidationErrors(req);

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('teamMembers', 'name role image');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
// @desc    Delete project (hard delete)
// @route   DELETE /api/projects/:id
// @access  Private/Admin
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Hard delete
    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


// @desc    Permanently delete project
// @route   DELETE /api/projects/:id/permanent
// @access  Private/Admin
export const permanentDeleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Project permanently deleted'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get featured projects
// @route   GET /api/projects/featured
// @access  Public
export const getFeaturedProjects = async (req, res) => {
  try {
    const projects = await Project.getFeatured()
      .populate('teamMembers', 'name role image');

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get projects by category
// @route   GET /api/projects/category/:category
// @access  Public
export const getProjectsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { limit, page } = req.query;

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const projects = await Project.getByCategory(category)
      .populate('teamMembers', 'name role image')
      .skip(skip)
      .limit(limitNum);

    const total = await Project.countDocuments({ category, isPublic: true });

    res.status(200).json({
      success: true,
      count: projects.length,
      total,
      pages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: projects
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Toggle project featured status
// @route   PUT /api/projects/:id/featured
// @access  Private/Admin
export const toggleFeatured = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    project.featured = !project.featured;
    await project.save();

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update project order
// @route   PUT /api/projects/:id/order
// @access  Private/Admin
export const updateProjectOrder = async (req, res) => {
  try {
    const { order } = req.body;

    if (typeof order !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Order must be a number'
      });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { order },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get project statistics
// @route   GET /api/projects/stats
// @access  Private/Admin
export const getProjectStats = async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const publicProjects = await Project.countDocuments({ isPublic: true });
    const featuredProjects = await Project.countDocuments({ featured: true, isPublic: true });
    
    // Count by category
    const categoryStats = await Project.aggregate([
      { $match: { isPublic: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Count by status
    const statusStats = await Project.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Total views
    const viewsStats = await Project.aggregate([
      { $match: { isPublic: true } },
      { $group: { _id: null, totalViews: { $sum: '$stats.views' } } }
    ]);

    const stats = {
      total: totalProjects,
      public: publicProjects,
      featured: featuredProjects,
      hidden: totalProjects - publicProjects,
      totalViews: viewsStats[0]?.totalViews || 0,
      categories: categoryStats.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      statuses: statusStats.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {})
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Restore project (make public)
// @route   PUT /api/projects/:id/restore
// @access  Private/Admin
export const restoreProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { isPublic: true },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};