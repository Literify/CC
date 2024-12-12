const admin = require('firebase-admin');

const credentials = require('../services/serviceAccount.json')
const db = require("../config/db");

const verifyToken = async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split('Bearer ')[1];
  
      if (!token) {
        return res.status(403).json({ error: 'Unauthorized: No token provided' });
      }
  
      const decodedToken = await db.auth().verifyIdToken(token);
      req.user = decodedToken; // You can use `req.user` to access the user info in the controller
      next(); // Pass control to the next middleware/controller
    } catch (error) {
      console.error(error);
      res.status(403).json({ error: 'Unauthorized: Invalid or expired token' });
    }
  };

  module.exports = verifyToken;