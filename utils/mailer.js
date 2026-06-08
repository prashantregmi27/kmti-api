import nodemailer from 'nodemailer';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const logoPaths = [
  join(__dirname, '..', '..', 'client', 'public', 'logo.png'),
  join(__dirname, '..', 'public_html', 'logo.png'),
  join(__dirname, '..', '..', 'public_html', 'logo.png'),
];
let logoBase64 = '';
for (const p of logoPaths) {
  try {
    logoBase64 = readFileSync(p).toString('base64'); break;
  } catch { /* try next */ }
}

const COLLEGE = {
  name: 'Kalika Medical & Technical Institute',
  shortName: 'KMTI',
  tagline: 'Excellence in Medical & Technical Education',
  location: 'Gaindakot-5, Nawalpur, Nepal',
  phone: '+977-078-XXXXXX',
  email: 'kmticollege@gmail.com',
};

const createTransport = () => {
  const useSmtp = process.env.EMAIL_USER && process.env.EMAIL_PASS;
  if (useSmtp) {
    return nodemailer.createTransport({
      host: 'smtp.gmail.com', port: 587, secure: false,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
  }
  return nodemailer.createTransport({
    sendmail: true, newline: 'unix', path: '/usr/sbin/sendmail',
  });
};

const logoHtml = logoBase64
  ? `<img src="data:image/png;base64,${logoBase64}" alt="${COLLEGE.shortName}" style="width:80px;height:80px;border-radius:50%;border:3px solid #1e40af;object-fit:contain;" />`
  : '';

const confirmationTemplate = (data) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;">
  <table style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;margin-top:20px;margin-bottom:20px;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
    <tr>
      <td style="background:linear-gradient(135deg,#1e3a5f,#1e40af);padding:30px;text-align:center;color:#ffffff;">
        ${logoHtml}
        <h1 style="margin:10px 0 5px;font-size:24px;">${COLLEGE.name}</h1>
        <p style="margin:0;font-size:13px;opacity:0.9;">${COLLEGE.tagline}</p>
      </td>
    </tr>
    <tr>
      <td style="padding:30px;">
        <h2 style="color:#1e3a5f;margin:0 0 10px;">Application Received!</h2>
        <p style="color:#475569;line-height:1.6;">Dear <strong>${data.firstName} ${data.lastName}</strong>,</p>
        <p style="color:#475569;line-height:1.6;">Thank you for submitting your enrollment application to <strong>${COLLEGE.name}</strong>.</p>
        <p style="color:#475569;line-height:1.6;">We have received your application for <strong>${data.course}</strong>. Our admission team will review it and get back to you as soon as possible.</p>
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:15px;margin:20px 0;">
          <p style="color:#166534;margin:0;font-size:14px;"><strong>Next Steps:</strong></p>
          <ol style="color:#166534;margin:5px 0 0;padding-left:20px;font-size:13px;">
            <li>Our admission team will verify your application</li>
            <li>We will contact you via phone or email for further process</li>
            <li>Document verification and counseling will be scheduled</li>
            <li>Confirm your seat by paying the admission fee</li>
          </ol>
        </div>
        <p style="color:#475569;line-height:1.6;">If you have any questions, feel free to contact us.</p>
        <table style="background:#f1f5f9;border-radius:8px;padding:15px;margin:20px 0;width:100%;font-size:13px;color:#475569;">
          <tr><td style="padding:4px 10px;"><strong>Phone:</strong></td><td>${COLLEGE.phone}</td></tr>
          <tr><td style="padding:4px 10px;"><strong>Email:</strong></td><td>${COLLEGE.email}</td></tr>
          <tr><td style="padding:4px 10px;"><strong>Location:</strong></td><td>${COLLEGE.location}</td></tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="background:#1e3a5f;padding:15px;text-align:center;color:#94a3b8;font-size:11px;">
        <p style="margin:0;">&copy; ${new Date().getFullYear()} ${COLLEGE.name}. All rights reserved.</p>
        <p style="margin:5px 0 0;">${COLLEGE.location}</p>
      </td>
    </tr>
  </table>
</body>
</html>`;

const headerHtml = logoBase64
  ? `<table style="max-width:600px;background:linear-gradient(135deg,#1e3a5f,#1e40af);padding:20px;text-align:center;border-radius:8px 8px 0 0;">
       <tr><td>
         <img src="data:image/png;base64,${logoBase64}" alt="${COLLEGE.shortName}" style="width:60px;height:60px;border-radius:50%;border:2px solid #fff;object-fit:contain;" />
         <h2 style="color:#fff;margin:8px 0 0;">${COLLEGE.name}</h2>
       </td></tr>
     </table>`
  : `<h2>${COLLEGE.name}</h2>`;

const adminEnrollmentTemplate = (data) => `
${headerHtml}
<h3>New Enrollment Submission</h3>
<table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-family:Arial;width:100%;max-width:600px;">
  <tr><td><strong>Name</strong></td><td>${data.firstName} ${data.lastName}</td></tr>
  <tr><td><strong>Email</strong></td><td>${data.email}</td></tr>
  <tr><td><strong>Phone</strong></td><td>${data.phone}</td></tr>
  <tr><td><strong>Gender</strong></td><td>${data.gender || '-'}</td></tr>
  <tr><td><strong>Date of Birth</strong></td><td>${data.dateOfBirth || '-'}</td></tr>
  <tr><td><strong>Course</strong></td><td>${data.course}</td></tr>
  <tr><td><strong>Address</strong></td><td>${data.address || '-'}</td></tr>
  <tr><td><strong>GPA</strong></td><td>${data.gpa || '-'}</td></tr>
  <tr><td><strong>Message</strong></td><td>${data.message || '-'}</td></tr>
</table>`;

const adminContactTemplate = (data) => `
${headerHtml}
<h3>New Contact Message</h3>
<table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-family:Arial;width:100%;max-width:600px;">
  <tr><td><strong>Name</strong></td><td>${data.name}</td></tr>
  <tr><td><strong>Contact</strong></td><td>${data.contact}</td></tr>
  <tr><td><strong>Topic</strong></td><td>${data.topic || '-'}</td></tr>
  <tr><td><strong>Question</strong></td><td>${data.question}</td></tr>
</table>`;

const contactConfirmationTemplate = (data) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;">
  <table style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;margin-top:20px;margin-bottom:20px;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
    <tr>
      <td style="background:linear-gradient(135deg,#1e3a5f,#1e40af);padding:30px;text-align:center;color:#ffffff;">
        ${logoHtml}
        <h1 style="margin:10px 0 5px;font-size:24px;">${COLLEGE.name}</h1>
        <p style="margin:0;font-size:13px;opacity:0.9;">${COLLEGE.tagline}</p>
      </td>
    </tr>
    <tr>
      <td style="padding:30px;">
        <h2 style="color:#1e3a5f;margin:0 0 10px;">We've Received Your Query!</h2>
        <p style="color:#475569;line-height:1.6;">Dear <strong>${data.name}</strong>,</p>
        <p style="color:#475569;line-height:1.6;">Thank you for reaching out to <strong>${COLLEGE.name}</strong>. We have received your question regarding <strong>${data.topic || 'admission'}</strong>.</p>
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:15px;margin:20px 0;">
          <p style="color:#166534;margin:0 0 8px;font-size:14px;"><strong>Your Question:</strong></p>
          <p style="color:#166534;margin:0 0 8px;font-size:13px;font-style:italic;">"${data.question}"</p>
        </div>
        <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:15px;margin:20px 0;">
          <p style="color:#166534;margin:0;font-size:14px;"><strong>What happens next?</strong></p>
          <ol style="color:#166534;margin:5px 0 0;padding-left:20px;font-size:13px;">
            <li>Our admissions team will review your query</li>
            <li>We will contact you via phone or email within 24 hours</li>
            <li>All your questions will be answered personally</li>
          </ol>
        </div>
        <table style="background:#f1f5f9;border-radius:8px;padding:15px;margin:20px 0;width:100%;font-size:13px;color:#475569;">
          <tr><td style="padding:4px 10px;"><strong>Phone:</strong></td><td>${COLLEGE.phone}</td></tr>
          <tr><td style="padding:4px 10px;"><strong>Email:</strong></td><td>${COLLEGE.email}</td></tr>
          <tr><td style="padding:4px 10px;"><strong>Location:</strong></td><td>${COLLEGE.location}</td></tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="background:#1e3a5f;padding:15px;text-align:center;color:#94a3b8;font-size:11px;">
        <p style="margin:0;">&copy; ${new Date().getFullYear()} ${COLLEGE.name}. All rights reserved.</p>
        <p style="margin:5px 0 0;">${COLLEGE.location}</p>
      </td>
    </tr>
  </table>
</body>
</html>`;

export const sendEnrollmentEmail = async (data) => {
  try {
    const transport = createTransport();
    await transport.sendMail({
      from: `"${COLLEGE.shortName} Admission" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Enrollment Application – ${COLLEGE.name}`,
      html: adminEnrollmentTemplate(data),
    });
    console.log('Admin enrollment email sent');

    const applicantName = `${data.firstName} ${data.lastName}`;
    await transport.sendMail({
      from: `"${COLLEGE.name}" <${process.env.EMAIL_USER}>`,
      to: data.email,
      subject: `Application Received – ${COLLEGE.shortName} Admission`,
      html: confirmationTemplate(data),
    });
    console.log(`Confirmation email sent to ${data.email}`);
    return true;
  } catch (err) {
    console.error('Failed to send enrollment email:', err.message);
    return false;
  }
};

export const sendContactEmail = async (data) => {
  try {
    const transport = createTransport();
    await transport.sendMail({
      from: `"${COLLEGE.shortName} Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Contact Message – ${COLLEGE.name}`,
      html: adminContactTemplate(data),
    });
    console.log('Admin contact email sent');

    const contactValue = (data.contact || '').trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactValue);
    if (isEmail) {
      await transport.sendMail({
        from: `"${COLLEGE.name}" <${process.env.EMAIL_USER}>`,
        to: contactValue,
        subject: `We Received Your Query – ${COLLEGE.shortName}`,
        html: contactConfirmationTemplate(data),
      });
      console.log(`Contact confirmation sent to ${contactValue}`);
    }
  } catch (err) {
    console.error('Failed to send contact email:', err.message);
  }
};
