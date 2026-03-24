import Contact from '../models/Contact.js';
import { validationResult } from 'express-validator';
import nodemailer from 'nodemailer';

// Helper function to handle validation errors
const handleValidationErrors = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    throw new Error(errorMessages.join('. '));
  }
};

// Email transporter setup
const createEmailTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send notification email to admin
const sendNotificationEmail = async (contactData) => {
  try {
    const transporter = createEmailTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Form Submission - ${contactData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF3C6E;">New Contact Form Submission</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Contact Details</h3>
            <p><strong>Name:</strong> ${contactData.name}</p>
            <p><strong>Email:</strong> ${contactData.email}</p>
            <p><strong>Phone:</strong> ${contactData.phone || 'Not provided'}</p>
            <p><strong>Subject:</strong> ${contactData.subject}</p>
            <p><strong>Category:</strong> ${contactData.category}</p>
          </div>
          <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">Message</h3>
            <p style="line-height: 1.6; white-space: pre-wrap;">${contactData.message}</p>
          </div>
          <div style="margin-top: 20px; padding: 15px; background: #e7f3ff; border-radius: 8px;">
            <p style="margin: 0; font-size: 14px; color: #666;">
              <strong>Received:</strong> ${new Date().toLocaleString()}<br>
              <strong>IP Address:</strong> ${contactData.ipAddress}<br>
              <strong>User Agent:</strong> ${contactData.userAgent}
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending notification email:', error);
  }
};

// Send auto-reply email to user
const sendAutoReplyEmail = async (contactData) => {
  try {
    const transporter = createEmailTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: contactData.email,
      subject: 'شكراً لتواصلك معنا - Thank you for contacting us',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #FF3C6E, #8C1CCB);">
            <h1 style="color: white; margin: 0;">Shift Start</h1>
            <p style="color: white; margin: 10px 0 0;">نقطة تحول</p>
          </div>
          
          <div style="padding: 30px 20px; background: #fff;">
            <h2 style="color: #333; margin-bottom: 20px;">مرحباً ${contactData.name}</h2>
            <p style="line-height: 1.6; color: #555;">
              شكراً لك على تواصلك معنا. لقد تم استلام رسالتك بنجاح وسيقوم فريقنا بالرد عليك في أقرب وقت ممكن.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${contactData.name}</h2>
            <p style="line-height: 1.6; color: #555;">
              Thank you for contacting us. We have successfully received your message and our team will respond to you as soon as possible.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">تفاصيل رسالتك - Your Message Details</h3>
              <p><strong>الموضوع - Subject:</strong> ${contactData.subject}</p>
              <p><strong>التصنيف - Category:</strong> ${contactData.category}</p>
              <p><strong>تاريخ الإرسال - Date:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://shiftstart.sy" style="background: linear-gradient(135deg, #FF3C6E, #8C1CCB); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block;">
                زيارة موقعنا - Visit Our Website
              </a>
            </div>
          </div>
          
          <div style="padding: 20px; background: #f8f9fa; text-align: center; color: #666; font-size: 14px;">
            <p style="margin: 0;">
              Shift Start - نقطة تحول<br>
              Professional Web Development Team<br>
              <a href="mailto:info@shiftstart.sy" style="color: #FF3C6E;">info@shiftstart.sy</a> | 
              <a href="https://shiftstart.sy" style="color: #FF3C6E;">www.shiftstart.sy</a>
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending auto-reply email:', error);
  }
};

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
export const submitContactForm = async (req, res) => {
  try {
    handleValidationErrors(req);

    const { name, email, phone, subject, message, category } = req.body;

    // Check for spam
    const isSpam = Contact.detectSpam(message, email);

    // Create contact record
    const contactData = {
      name,
      email,
      phone,
      subject,
      message,
      category: category || 'general',
      ipAddress: req.ipAddress,
      userAgent: req.userAgent,
      isSpam
    };

    const contact = await Contact.create(contactData);

    // Send emails only if not spam
    if (!isSpam) {
      // Send notification to admin
      await sendNotificationEmail(contactData);
      
      // Send auto-reply to user
      await sendAutoReplyEmail(contactData);
    }

    res.status(201).json({
      success: true,
      message: 'تم إرسال رسالتك بنجاح. سنتواصل معك قريباً - Your message has been sent successfully. We will contact you soon.',
      data: {
        id: contact._id,
        status: contact.status
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
export const getContactMessages = async (req, res) => {
  try {
    const { status, category, priority, page, limit, search, spam } = req.query;
    let query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by priority
    if (priority) {
      query.priority = priority;
    }

    // Filter spam
    if (spam !== undefined) {
      query.isSpam = spam === 'true';
    } else {
      query.isSpam = false; // Default to non-spam messages
    }

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const contacts = await Contact.find(query)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Contact.countDocuments(query);

    res.status(200).json({
      success: true,
      count: contacts.length,
      total,
      pages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: contacts
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single contact message
// @route   GET /api/contact/:id
// @access  Private/Admin
export const getContactMessage = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('notes.addedBy', 'name email');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    // Mark as read if it's new
    if (contact.status === 'new') {
      await contact.markAsRead(req.user.id);
    }

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update contact message status
// @route   PUT /api/contact/:id/status
// @access  Private/Admin
export const updateContactStatus = async (req, res) => {
  try {
    const { status, priority } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add note to contact message
// @route   POST /api/contact/:id/notes
// @access  Private/Admin
export const addContactNote = async (req, res) => {
  try {
    const { note } = req.body;

    if (!note || note.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Note content is required'
      });
    }

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    await contact.addNote(note, req.user.id);

    const updatedContact = await Contact.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('notes.addedBy', 'name email');

    res.status(200).json({
      success: true,
      data: updatedContact
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mark contact as spam
// @route   PUT /api/contact/:id/spam
// @access  Private/Admin
export const markAsSpam = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isSpam: true, status: 'archived' },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message marked as spam',
      data: contact
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteContactMessage = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    await Contact.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Contact message deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get contact statistics
// @route   GET /api/contact/stats
// @access  Private/Admin
export const getContactStats = async (req, res) => {
  try {
    const totalMessages = await Contact.countDocuments({ isSpam: false });
    const newMessages = await Contact.countDocuments({ status: 'new', isSpam: false });
    const readMessages = await Contact.countDocuments({ status: 'read', isSpam: false });
    const repliedMessages = await Contact.countDocuments({ status: 'replied', isSpam: false });
    const spamMessages = await Contact.countDocuments({ isSpam: true });

    // Count by category
    const categoryStats = await Contact.aggregate([
      { $match: { isSpam: false } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Count by priority
    const priorityStats = await Contact.aggregate([
      { $match: { isSpam: false } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Messages per day (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const dailyStats = await Contact.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          isSpam: false
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const stats = {
      total: totalMessages,
      new: newMessages,
      read: readMessages,
      replied: repliedMessages,
      spam: spamMessages,
      categories: categoryStats.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      priorities: priorityStats.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      dailyStats: dailyStats.reduce((acc, curr) => {
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