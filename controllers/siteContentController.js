import SiteContent from '../models/SiteContent.js';

const defaultSections = [
  {
    section: 'hero',
    title: 'Shaping the Future of Medical & Technical Education',
    subtitle: 'Join KMTI — the leading institute in Nawalpur offering accredited diploma programs since 2054 B.S.',
    description: '',
    image: '',
    buttonText: 'Apply Now',
    buttonLink: '/enroll',
    content: { secondaryButtonText: 'Explore Courses', secondaryButtonLink: '/courses' },
  },
  {
    section: 'about',
    title: 'Who We Are',
    subtitle: 'Excellence in Medical & Technical Education',
    description: 'Kalika Medical & Technical Institute (KMTI) was established in 2054 B.S. with a vision to provide quality medical and technical education in the Gandaki province of Nepal. Located in Gaindakot, Nawalpur, we are one of the leading CTEVT-affiliated institutes in the region. Over the past three decades, KMTI has produced over 1,000 skilled graduates serving across Nepal and internationally.',
    image: '/building.jpg',
    buttonText: '',
    buttonLink: '',
    content: {},
  },
  {
    section: 'stats',
    title: '',
    subtitle: '',
    description: '',
    image: '',
    buttonText: '',
    buttonLink: '',
    content: {
      counters: [
        { value: 5100, suffix: '+', label: 'Graduates' },
        { value: 12, suffix: '+', label: 'Programs' },
        { value: 29, suffix: '+', label: 'Years of Service' },
        { value: 98, suffix: '%', label: 'Placement Rate' },
      ],
    },
  },
  {
    section: 'features',
    title: 'Why Choose KMTI',
    subtitle: 'What sets us apart',
    description: '',
    image: '',
    buttonText: '',
    buttonLink: '',
    content: {
      cards: [
        { icon: '🏛️', title: 'CTEVT Affiliated', text: 'All programs fully recognized by CTEVT and the Government of Nepal.' },
        { icon: '🏥', title: 'Clinical Training', text: 'Medical students receive mandatory clinical training at affiliated hospitals.' },
      ],
    },
  },
];

export const seedSiteContent = async () => {
  for (const section of defaultSections) {
    await SiteContent.findOneAndUpdate(
      { section: section.section },
      { $setOnInsert: section },
      { upsert: true }
    );
  }
};

export const getSiteContent = async (req, res) => {
  try {
    const sections = await SiteContent.find({ isActive: true });
    res.json({ success: true, data: sections });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateSiteContent = async (req, res) => {
  try {
    const { section } = req.params;
    const allowed = ['title', 'subtitle', 'description', 'image', 'buttonText', 'buttonLink', 'content', 'isActive'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const doc = await SiteContent.findOneAndUpdate(
      { section },
      { $set: updates },
      { new: true, upsert: true }
    );
    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
