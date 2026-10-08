import db from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Vérifier si un admin existe déjà (premier utilisateur = libre, sinon auth requise)
    const countResult = await db.query('SELECT COUNT(*) FROM users');
    const userCount = parseInt(countResult.rows[0].count);
    if (userCount > 0 && !req.user) {
      return res.status(403).json({ error: 'Inscription réservée aux administrateurs connectés' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const { rows } = await db.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role`,
      [name, email, hashedPassword, role || 'admin']
    );

    const user = rows[0];
    const token = generateToken(user);
    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = rows[0];
    if (!user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const token = generateToken(user);
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT id, name, email, role, created_at AS "createdAt" FROM users WHERE id = $1',
      [req.user.id]
    );
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// PUT /api/auth/me
export const updateMe = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (name) {
      fields.push(`name = $${paramIndex++}`);
      values.push(name);
    }
    if (email) {
      fields.push(`email = $${paramIndex++}`);
      values.push(email);
    }
    if (password) {
      fields.push(`password = $${paramIndex++}`);
      values.push(await bcrypt.hash(password, 12));
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'Aucun champ à modifier' });
    }

    values.push(req.user.id);
    const { rows } = await db.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramIndex}
       RETURNING id, name, email, role`,
      values
    );
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};
