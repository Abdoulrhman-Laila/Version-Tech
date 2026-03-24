import express from 'express';
import { body } from 'express-validator';
import {
  getTeamMembers,
  getTeamMember,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  permanentDeleteTeamMember,
  getTeamMembersByRole,
  updateTeamMemberOrder,
  reactivateTeamMember,
  getTeamStats
} from '../controllers/teamController.js';
import { protect, restrictTo, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const teamMemberValidation = [
  body('name.ar')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Arabic name must be between 2 and 50 characters'),
  body('name.en')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('English name must be between 2 and 50 characters'),
  body('role')
    .isIn(['fullstack', 'frontend', 'backend', 'ui', 'ux', 'manager', 'designer'])
    .withMessage('Invalid role'),
  body('bio.ar')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Arabic bio must be between 10 and 500 characters'),
  body('bio.en')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('English bio must be between 10 and 500 characters'),
  body('skills')
    .isArray({ min: 1 })
    .withMessage('At least one skill is required'),
  body('skills.*')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Skill cannot be empty'),
  body('social.github')
    .optional()
    .isURL()
    .withMessage('Invalid GitHub URL'),
  body('social.linkedin')
    .optional()
    .isURL()
    .withMessage('Invalid LinkedIn URL'),
  body('social.twitter')
    .optional()
    .isURL()
    .withMessage('Invalid Twitter URL'),
  body('social.dribbble')
    .optional()
    .isURL()
    .withMessage('Invalid Dribbble URL'),
  body('social.behance')
    .optional()
    .isURL()
    .withMessage('Invalid Behance URL'),
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
router.get('/', optionalAuth, getTeamMembers);
router.get('/role/:role', getTeamMembersByRole);
router.get('/:id', optionalAuth, getTeamMember);

// Protected routes (Admin only)
router.use(protect, restrictTo('admin'));

router.post('/', teamMemberValidation, createTeamMember);
router.put('/:id', teamMemberValidation, updateTeamMember);
router.delete('/:id', deleteTeamMember);
router.delete('/:id/permanent', permanentDeleteTeamMember);
router.put('/:id/order', orderValidation, updateTeamMemberOrder);
router.put('/:id/reactivate', reactivateTeamMember);
router.get('/admin/stats', getTeamStats);

export default router;
