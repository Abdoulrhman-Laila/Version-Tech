import express from 'express';
import { body } from 'express-validator';
import {
  submitContactForm,
  getContactMessages,
  getContactMessage,
  updateContactStatus,
  addContactNote,
  markAsSpam,
  deleteContactMessage,
  getContactStats
} from '../controllers/contactController.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { contactLimiter, trackIP } from '../middleware/security.js';

const router = express.Router();

// Validation rules
const contactFormValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('subject')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Subject must be between 5 and 200 characters'),
  body('message')
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('Message must be between 20 and 2000 characters'),
  body('category')
    .optional()
    .isIn(['general', 'project', 'support', 'partnership', 'career'])
    .withMessage('Invalid category')
];

const statusUpdateValidation = [
  body('status')
    .optional()
    .isIn(['new', 'read', 'replied', 'archived'])
    .withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['low', 'normal', 'high', 'urgent'])
    .withMessage('Invalid priority')
];

const noteValidation = [
  body('note')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Note must be between 1 and 1000 characters')
];

// Public routes
router.post('/', contactLimiter, trackIP, contactFormValidation, submitContactForm);

// Protected routes (Admin only)
router.use(protect, restrictTo('admin'));

router.get('/', getContactMessages);
router.get('/stats', getContactStats);
router.get('/:id', getContactMessage);
router.put('/:id/status', statusUpdateValidation, updateContactStatus);
router.post('/:id/notes', noteValidation, addContactNote);
router.put('/:id/spam', markAsSpam);
router.delete('/:id', deleteContactMessage);

export default router;
