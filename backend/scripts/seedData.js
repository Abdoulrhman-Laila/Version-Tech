import fs from 'fs';
import mongoose from 'mongoose';
import colors from 'colors';
import dotenv from 'dotenv';

// Load models
import User from '../models/User.js';
import TeamMember from '../models/TeamMember.js';
import Project from '../models/Project.js';
import Contact from '../models/Contact.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@shiftstart.sy',
    password: 'Admin123!@#',
    role: 'admin'
  },
  {
    name: 'Test User',
    email: 'user@shiftstart.sy',
    password: 'User123!@#',
    role: 'user'
  }
];

const teamMembers = [
  {
    name: {
      ar: 'أحمد محمد',
      en: 'Ahmed Mohammed'
    },
    role: 'fullstack',
    bio: {
      ar: 'مطور ويب متخصص في React و Node.js مع خبرة تزيد عن 5 سنوات في تطوير التطبيقات الحديثة',
      en: 'Web developer specialized in React and Node.js with over 5 years of experience in modern application development'
    },
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    skills: ['React', 'Node.js', 'MongoDB', 'Express', 'TypeScript', 'GraphQL'],
    social: {
      github: 'https://github.com/ahmed-mohammed',
      linkedin: 'https://linkedin.com/in/ahmed-mohammed',
      twitter: 'https://twitter.com/ahmed_mohammed'
    },
    order: 1,
    isActive: true
  },
  {
    name: {
      ar: 'فاطمة أحمد',
      en: 'Fatima Ahmed'
    },
    role: 'frontend',
    bio: {
      ar: 'مطورة واجهات أمامية متخصصة في React و Vue.js مع شغف في تصميم تجارب المستخدم المميزة',
      en: 'Frontend developer specialized in React and Vue.js with passion for creating amazing user experiences'
    },
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
    skills: ['React', 'Vue.js', 'CSS3', 'Sass', 'JavaScript', 'TypeScript'],
    social: {
      github: 'https://github.com/fatima-ahmed',
      linkedin: 'https://linkedin.com/in/fatima-ahmed',
      dribbble: 'https://dribbble.com/fatima-ahmed'
    },
    order: 2,
    isActive: true
  },
  {
    name: {
      ar: 'محمد علي',
      en: 'Mohammed Ali'
    },
    role: 'backend',
    bio: {
      ar: 'مطور خلفي متخصص في Node.js و Python مع خبرة في بناء APIs قابلة للتوسع وآمنة',
      en: 'Backend developer specialized in Node.js and Python with experience in building scalable and secure APIs'
    },
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
    skills: ['Node.js', 'Python', 'Express', 'MongoDB', 'PostgreSQL', 'Docker'],
    social: {
      github: 'https://github.com/mohammed-ali',
      linkedin: 'https://linkedin.com/in/mohammed-ali'
    },
    order: 3,
    isActive: true
  },
  {
    name: {
      ar: 'سارة خالد',
      en: 'Sara Khaled'
    },
    role: 'ui',
    bio: {
      ar: 'مصممة واجهات مستخدم متخصصة في إنشاء تصاميم حديثة وسهلة الاستخدام مع التركيز على تجربة المستخدم',
      en: 'UI designer specialized in creating modern and user-friendly designs with focus on user experience'
    },
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
    skills: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'Sketch', 'InVision'],
    social: {
      linkedin: 'https://linkedin.com/in/sara-khaled',
      dribbble: 'https://dribbble.com/sara-khaled',
      behance: 'https://behance.net/sara-khaled'
    },
    order: 4,
    isActive: true
  }
];

const projects = [
  {
    title: {
      ar: 'متجر إلكتروني متكامل',
      en: 'Complete E-commerce Platform'
    },
    description: {
      ar: 'منصة تجارة إلكترونية متكاملة تتضمن نظام إدارة المنتجات والطلبات ونظام دفع آمن مع واجهة مستخدم حديثة ومتجاوبة',
      en: 'Complete e-commerce platform featuring product and order management system with secure payment gateway and modern responsive user interface'
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
        alt: {
          ar: 'واجهة المتجر الإلكتروني',
          en: 'E-commerce store interface'
        },
        isPrimary: true
      }
    ],
    category: 'ecommerce',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redux', 'Express'],
    links: {
      live: 'https://demo-ecommerce.shiftstart.sy',
      github: 'https://github.com/shiftstart/ecommerce-demo'
    },
    client: {
      name: 'TechMart',
      website: 'https://techmart.example.com'
    },
    duration: '3 months',
    status: 'completed',
    featured: true,
    order: 1,
    isPublic: true,
    completedAt: new Date('2023-12-15'),
    stats: {
      views: 145,
      likes: 23
    }
  },
  {
    title: {
      ar: 'موقع شركة تقنية',
      en: 'Tech Company Website'
    },
    description: {
      ar: 'موقع ويب احترافي لشركة تقنية يتضمن عرض الخدمات والمنتجات مع نظام إدارة المحتوى ولوحة تحكم إدارية',
      en: 'Professional website for tech company featuring services and products showcase with content management system and admin dashboard'
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
        alt: {
          ar: 'الصفحة الرئيسية للموقع',
          en: 'Website homepage'
        },
        isPrimary: true
      }
    ],
    category: 'corporate',
    technologies: ['React', 'Next.js', 'TailwindCSS', 'Framer Motion', 'Strapi'],
    links: {
      live: 'https://demo-corporate.shiftstart.sy'
    },
    client: {
      name: 'InnovateTech',
      website: 'https://innovatetech.example.com'
    },
    duration: '2 months',
    status: 'completed',
    featured: true,
    order: 2,
    isPublic: true,
    completedAt: new Date('2024-01-10'),
    stats: {
      views: 89,
      likes: 15
    }
  },
  {
    title: {
      ar: 'تطبيق إدارة المهام',
      en: 'Task Management App'
    },
    description: {
      ar: 'تطبيق ويب لإدارة المهام والمشاريع يتضمن ميزات التعاون الجماعي وتتبع التقدم والإشعارات الفورية',
      en: 'Web application for task and project management featuring team collaboration, progress tracking, and real-time notifications'
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
        alt: {
          ar: 'واجهة تطبيق إدارة المهام',
          en: 'Task management app interface'
        },
        isPrimary: true
      }
    ],
    category: 'website',
    technologies: ['Vue.js', 'Node.js', 'Socket.io', 'PostgreSQL', 'Redis'],
    links: {
      live: 'https://demo-tasks.shiftstart.sy',
      github: 'https://github.com/shiftstart/task-manager'
    },
    duration: '4 months',
    status: 'completed',
    featured: false,
    order: 3,
    isPublic: true,
    completedAt: new Date('2023-11-20'),
    stats: {
      views: 67,
      likes: 12
    }
  }
];

const contacts = [
  {
    name: 'أحمد محمود',
    email: 'ahmed.mahmoud@example.com',
    phone: '+963123456789',
    subject: 'استفسار حول خدمات تطوير المواقع',
    message: 'مرحباً، أرغب في الحصول على معلومات حول خدمات تطوير المواقع الإلكترونية التي تقدمونها. لدي مشروع لشركة ناشئة وأحتاج إلى موقع احترافي.',
    category: 'project',
    status: 'new',
    priority: 'normal',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    isSpam: false
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    subject: 'Partnership Inquiry',
    message: 'Hello, I represent a digital marketing agency and I would like to explore potential partnership opportunities with your development team.',
    category: 'partnership',
    status: 'read',
    priority: 'high',
    ipAddress: '10.0.0.50',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    isSpam: false
  }
];

// Import data
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await TeamMember.deleteMany();
    await Project.deleteMany();
    await Contact.deleteMany();

    // Import users
    await User.create(users);
    console.log('Users imported successfully'.green);

    // Import team members
    const createdTeamMembers = await TeamMember.create(teamMembers);
    console.log('Team members imported successfully'.green);

    // Add team member references to projects
    const updatedProjects = projects.map((project, index) => ({
      ...project,
      teamMembers: [createdTeamMembers[0]._id, createdTeamMembers[1]._id] // Add first two team members
    }));

    // Import projects
    await Project.create(updatedProjects);
    console.log('Projects imported successfully'.green);

    // Import contacts
    await Contact.create(contacts);
    console.log('Contacts imported successfully'.green);

    console.log('All data imported successfully! 🎉'.cyan.bold);
    process.exit();
  } catch (err) {
    console.error(`Error importing data: ${err}`.red);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await User.deleteMany();
    await TeamMember.deleteMany();
    await Project.deleteMany();
    await Contact.deleteMany();
    
    console.log('All data deleted successfully! 💥'.red.bold);
    process.exit();
  } catch (err) {
    console.error(`Error deleting data: ${err}`.red);
    process.exit(1);
  }
};

// Check command line arguments
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please specify -i to import data or -d to delete data'.yellow);
  process.exit();
}