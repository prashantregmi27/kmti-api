import Setting from '../models/Setting.js';

// Seed default settings if empty
export const seedSettings = async () => {
  const count = await Setting.countDocuments();
  if (count > 0) return;

  const defaults = [
    { key: 'college_name', value: 'Kalika Medical & Technical Institute', label: 'College Name', type: 'text', section: 'general' },
    { key: 'college_short_name', value: 'KMTI', label: 'Short Name', type: 'text', section: 'general' },
    { key: 'college_tagline', value: 'Excellence in Medical & Technical Education', label: 'Tagline', type: 'text', section: 'general' },
    { key: 'college_established', value: '2054 B.S.', label: 'Established', type: 'text', section: 'general' },
    { key: 'college_affiliation', value: 'CTEVT Affiliated • Government Approved', label: 'Affiliation', type: 'text', section: 'general' },

    { key: 'email', value: 'kmticollege@gmail.com', label: 'Email Address', type: 'email', section: 'contact' },
    { key: 'phone', value: '+977-078-XXXXXX', label: 'Phone Number', type: 'phone', section: 'contact' },
    { key: 'location', value: 'Gaindakot-5, Nawalpur, Nepal', label: 'Location', type: 'text', section: 'contact' },
    { key: 'office_hours', value: 'Sunday – Friday: 10:00 AM – 5:00 PM', label: 'Office Hours', type: 'text', section: 'contact' },

    { key: 'social_facebook', value: 'https://www.facebook.com/share/1cMaJrQcWF/?mibextid=wwXIfr', label: 'Facebook URL', type: 'url', section: 'social' },
    { key: 'social_youtube', value: 'https://youtube.com', label: 'YouTube URL', type: 'url', section: 'social' },
    { key: 'social_instagram', value: 'https://instagram.com', label: 'Instagram URL', type: 'url', section: 'social' },

    { key: 'hero_title', value: 'Shaping the Future of <span class="text-[#3fb5ff]">Medical & Technical</span> Education', label: 'Home Hero Title (HTML allowed)', type: 'textarea', section: 'home' },
    { key: 'hero_subtitle', value: 'Join KMTI — the leading institute in Nawalpur offering accredited diploma programs in Nursing, Pharmacy, Lab Technology, Engineering, and short-term skill courses since 2054 B.S.', label: 'Home Hero Subtitle', type: 'textarea', section: 'home' },
    { key: 'hero_cta_text', value: 'Apply Now', label: 'Hero CTA Button Text', type: 'text', section: 'home' },
    { key: 'hero_cta_link', value: '/enroll', label: 'Hero CTA Button Link', type: 'url', section: 'home' },
    { key: 'hero_secondary_cta_text', value: 'Explore Courses', label: 'Hero Secondary CTA Text', type: 'text', section: 'home' },
    { key: 'hero_secondary_cta_link', value: '/courses', label: 'Hero Secondary CTA Link', type: 'url', section: 'home' },

    { key: 'logo', value: '/logo.png', label: 'Site Logo', type: 'image', section: 'images' },
    { key: 'favicon', value: '/logo.png', label: 'Favicon', type: 'image', section: 'images' },
    { key: 'hero_bg', value: '', label: 'Hero Background Image', type: 'image', section: 'images' },

    { key: 'stats_graduates', value: '5100', label: 'Graduates Count', type: 'number', section: 'stats' },
    { key: 'stats_programs', value: '12', label: 'Programs Count', type: 'number', section: 'stats' },
    { key: 'stats_years', value: '29', label: 'Years of Service', type: 'number', section: 'stats' },
    { key: 'stats_placement', value: '98', label: 'Placement Rate %', type: 'number', section: 'stats' },

    { key: 'footer_description', value: 'Providing quality medical & technical education since 2054 B.S. Affiliated with CTEVT and approved by the Government of Nepal.', label: 'Footer Description', type: 'textarea', section: 'footer' },
    { key: 'footer_copyright', value: '© 2081 B.S. {name}. All rights reserved.', label: 'Footer Copyright (use {name} for college name)', type: 'text', section: 'footer' },
  ];

  await Setting.insertMany(defaults);
  console.log('Default settings seeded');
};

export const updateSettingByKey = async (key, value) => {
  try {
    await Setting.updateOne({ key }, { $set: { value } }, { upsert: true });
  } catch (err) {
    console.error(`Failed to update setting ${key}:`, err.message);
  }
};

export const getSettings = async (req, res) => {
  try {
    const settings = await Setting.find().sort({ section: 1, key: 1 }).lean();
    const grouped = settings.reduce((acc, s) => {
      if (!acc[s.section]) acc[s.section] = [];
      acc[s.section].push(s);
      return acc;
    }, {});
    res.json({ success: true, data: grouped, flat: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateSetting = async (req, res) => {
  try {
    const { key, value } = req.body;
    const setting = await Setting.findOneAndUpdate(
      { key },
      { value },
      { new: true, upsert: true }
    );
    res.json({ success: true, data: setting });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const entries = req.body.entries || [];
    const ops = entries.map(({ key, value }) => ({
      updateOne: { filter: { key }, update: { $set: { value } }, upsert: true },
    }));
    await Setting.bulkWrite(ops);
    const settings = await Setting.find().lean();
    res.json({ success: true, data: settings, message: 'Settings saved successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
