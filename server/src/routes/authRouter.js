const { Router } = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../../db/models');
const generateTokens = require('../utils/generateTokens');
const cookiesConfig = require('../config/cookiesConfig');
const verifyRefreshToken = require('../middlewares/verifyRefreshToken');
const sendEmailNotification = require('../utils/sendEmailNotification');

const authRouter = Router();

authRouter.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) return res.status(401).send({ message: 'Fill all fields' });

    const [user, created] = await User.findOrCreate({
      where: { email },
      defaults: { name, password: await bcrypt.hash(password, 10), isAdmin: false },
    });

    await sendEmailNotification(email, name);

    if (!created) {
      return res.status(403).json({ message: 'User already exists' });
    }

    const plainUser = user.get();
    delete plainUser.password;

    const { accessToken, refreshToken } = generateTokens({ user: plainUser });

    return res
      .cookie('refreshToken', refreshToken, cookiesConfig.refresh)
      .status(200)
      .json({ accessToken, user: plainUser });
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});

authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(401).json({ message: 'All fields must be present' });

    const user = await User.findOne({
      where: { email },
    });

    if (!user) return res.status(401).json({ message: 'User not found' });

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) return res.status(401).json({ message: 'Incorrect password' });

    const plainUser = user.get();
    delete plainUser.password;

    const { accessToken, refreshToken } = generateTokens({ user: plainUser });

    return res
      .cookie('refreshToken', refreshToken, cookiesConfig.refresh)
      .status(200)
      .json({ accessToken, user: plainUser });
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});

authRouter.get('/logout', (req, res) => {
  res.clearCookie('refreshToken').sendStatus(200);
});

authRouter.get('/check', verifyRefreshToken, (req, res) => {
  res.json({ user: res.locals.user });
});

module.exports = authRouter;
