import express from 'express';
import { body } from 'express-validator';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  permanentDeleteProject,
  getFeaturedProjects,
  getProjectsByCategory,
  toggleFeatured,
  updateProjectOrder,
  getProjectStats,
  restoreProject
} from '../controllers/projectController.js';
import { protect, restrictTo, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const projectValidation = [
  body('title.ar')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Arabic title must be between 3 and 100 characters'),
  body('title.en')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('English title must be between 3 and 100 characters'),
  body('description.ar')
    .trim()
    .isLength({ min: 20, max: 1000 })
    .withMessage('Arabic description must be between 20 and 1000 characters'),
  body('description.en')
    .trim()
    .isLength({ min: 20, max: 1000 })
    .withMessage('English description must be between 20 and 1000 characters'),
  body('category')
    .isIn(['website', 'mobile', 'ecommerce', 'corporate', 'other'])
    .withMessage('Invalid category'),
  body('images')
    .isArray({ min: 1 })
    .withMessage('At least one image is required'),
  body('images.*.url')
    .isURL()
    .withMessage('Invalid image URL'),
  body('technologies')
    .isArray({ min: 1 })
    .withMessage('At least one technology is required'),
  body('technologies.*')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Technology cannot be empty'),
  body('links.live')
    .optional()
    .isURL()
    .withMessage('Invalid live URL'),
  body('links.github')
    .optional()
    .isURL()
    .withMessage('Invalid GitHub URL'),
  body('links.demo')
    .optional()
    .isURL()
    .withMessage('Invalid demo URL'),
  body('status')
    .optional()
    .isIn(['planning', 'development', 'testing', 'completed', 'maintained'])
    .withMessage('Invalid status'),
  body('teamMembers')
    .optional()
    .isArray()
    .withMessage('Team members must be an array'),
  body('teamMembers.*')
    .optional()
    .isMongoId()
    .withMessage('Invalid team member ID'),
  body('order')
    .optional()
    .isNumeric()
    .withMessage('Order must be a number')
];

const orderValidation = [
  body('order')
    .isNumeric()
    .withMessage('Order must be a number')
];

// Public routes
router.get('/', optionalAuth, getProjects);
router.get('/featured', getFeaturedProjects);
router.get('/category/:category', getProjectsByCategory);
router.get('/:id', optionalAuth, getProject);

// Protected routes (Admin only)
router.use(protect, restrictTo('admin'));

router.post('/', projectValidation, createProject);
router.put('/:id', projectValidation, updateProject);
router.delete('/:id', deleteProject);
router.delete('/:id/permanent', permanentDeleteProject);
router.put('/:id/featured', toggleFeatured);
router.put('/:id/order', orderValidation, updateProjectOrder);
router.put('/:id/restore', restoreProject);
router.get('/admin/stats', getProjectStats);

export default router;
