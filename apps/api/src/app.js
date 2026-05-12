const express = require('express');
const cors = require('cors');
const authRoutes = require('./features/auth/auth.routes');
const usersRoutes = require('./features/users/users.routes');
const { extendSession } = require('./shared/middlewares/session.middleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.post('/auth/extend-session', extendSession);
module.exports = app;