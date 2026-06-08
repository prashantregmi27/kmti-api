import jwt from 'jsonwebtoken';

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';
const JWT_SECRET = process.env.JWT_SECRET || 'kmti_jwt_secret_2026';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (username !== ADMIN_USER || password !== ADMIN_PASS) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ success: true, token, user: { username } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const verifyToken = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(header.split(' ')[1], JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};
