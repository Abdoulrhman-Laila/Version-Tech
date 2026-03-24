import TeamMember from '../models/TeamMember.js';
import { validationResult } from 'express-validator';

// Helper function to handle validation errors
const handleValidationErrors = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    throw new Error(errorMessages.join('. '));
  }
};

// @desc    Get all team members
// @route   GET /api/team
// @access  Public
export const getTeamMembers = async (req, res) => {
  try {
    const { role, active } = req.query;
    let query = {};

    // Filter by role if specified
    if (role) {
      query.role = role;
    }

    // Filter by active status (default to true for public)
    if (active !== undefined) {
      query.isActive = active === 'true';
    } else {
      query.isActive = true; // Default to active members only
    }

    const teamMembers = await TeamMember.find(query).sort({ order: 1, createdAt: 1 });

    res.status(200).json({
      success: true,
      count: teamMembers.length,
      data: teamMembers
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single team member
// @route   GET /api/team/:id
// @access  Public
export const getTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    // Check if member is active (for public access)
    if (!teamMember.isActive && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    res.status(200).json({
      success: true,
      data: teamMember
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create team member
// @route   POST /api/team
// @access  Private/Admin
export const createTeamMember = async (req, res) => {
  try {
    handleValidationErrors(req);

    const teamMember = await TeamMember.create(req.body);

    res.status(201).json({
      success: true,
      data: teamMember
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update team member
// @route   PUT /api/team/:id
// @access  Private/Admin
export const updateTeamMember = async (req, res) => {
  try {
    handleValidationErrors(req);

    const teamMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    res.status(200).json({
      success: true,
      data: teamMember
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete team member
// @route   DELETE /api/team/:id
// @access  Private/Admin
export const deleteTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    // Soft delete - just set isActive to false
    teamMember.isActive = false;
    await teamMember.save();

    res.status(200).json({
      success: true,
      message: 'Team member deactivated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Permanently delete team member
// @route   DELETE /api/team/:id/permanent
// @access  Private/Admin
export const permanentDeleteTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    await TeamMember.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Team member permanently deleted'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get team members by role
// @route   GET /api/team/role/:role
// @access  Public
export const getTeamMembersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    
    const teamMembers = await TeamMember.getByRole(role);

    res.status(200).json({
      success: true,
      count: teamMembers.length,
      data: teamMembers
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update team member order
// @route   PUT /api/team/:id/order
// @access  Private/Admin
export const updateTeamMemberOrder = async (req, res) => {
  try {
    const { order } = req.body;

    if (typeof order !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Order must be a number'
      });
    }

    const teamMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      { order },
      { new: true, runValidators: true }
    );

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    res.status(200).json({
      success: true,
      data: teamMember
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Reactivate team member
// @route   PUT /api/team/:id/reactivate
// @access  Private/Admin
export const reactivateTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    res.status(200).json({
      success: true,
      data: teamMember
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get team statistics
// @route   GET /api/team/stats
// @access  Private/Admin
export const getTeamStats = async (req, res) => {
  try {
    const totalMembers = await TeamMember.countDocuments();
    const activeMembers = await TeamMember.countDocuments({ isActive: true });
    const inactiveMembers = await TeamMember.countDocuments({ isActive: false });

    // Count by roles
    const roleStats = await TeamMember.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const stats = {
      total: totalMembers,
      active: activeMembers,
      inactive: inactiveMembers,
      roles: roleStats.reduce((acc, curr) => {
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