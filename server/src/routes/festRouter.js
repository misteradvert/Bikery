const express = require('express');
// const { flushSync } = require('react-dom');
const sharp = require('sharp');
const fs = require('fs/promises');
const { Fest, User, CommentFest } = require('../../db/models');
const verifyAccessToken = require('../middlewares/verifyAccessToken');
const upload = require('../middlewares/upload');

const router = express.Router();

router.route('/').get(async (req, res) => {
  const fests = await Fest.findAll({
    order: [['id', 'DESC']],
    include: [User, { model: CommentFest, include: User }],
  });
  res.json(fests);
});

router.route('/add').post(verifyAccessToken, upload.single('image'), async (req, res) => {
  const { name, desc, date, place } = req.body;

  console.log(req.body, req.file);

  if (!name || !desc || !req.file || !place || !date) {
    return res.status(400).json({ message: 'Заполните все поля' });
  }

  try {
    const imageName1 = `${Date.now()}_fest.jpeg`;
    const outputBuffer = await sharp(req.file.buffer).jpeg().toBuffer();
    await fs.writeFile(`./public/img/fest/${imageName1}`, outputBuffer);

    const newFest = await Fest.create({
      name,
      desc,
      image: imageName1,
      date,
      place,
      userId: res.locals.user.id,
    });

    const newFestWithUser = await Fest.findOne({ where: { id: newFest.id }, include: User });
    res.status(201).json(newFestWithUser);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при создании нового фестиваля' });
  }
});

router
  .route('/:id')
  .delete(verifyAccessToken, async (req, res) => {
    try {
      await Fest.destroy({
        where: { id: req.params.id },
      });
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'ERROR DELETING FEST' });
    }
  })

  .put(verifyAccessToken, upload.single('image'), async (req, res) => {
    const { id } = req.params;

    const imageNameFest = `${Date.now()}_fest_edited.jpeg`;
    const outputBuffer = await sharp(req.file.buffer).jpeg().toBuffer();
    await fs.writeFile(`./public/img/fest/${imageNameFest}`, outputBuffer);

    await Fest.update({ ...req.body, image: imageNameFest }, { where: { id } });
    const updatedFest = await Fest.findOne({ where: { id } });
    res.json(updatedFest);
  })

  .get(async (req, res) => {
    try {
      const fest = await Fest.findOne({ where: { id: req.params.id }, include: User });
      if (!fest) {
        return res.status(404).json({ message: 'Fest not found' });
      }
      return res.json(fest);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'ERROR GETTING FEST' });
    }
  });

module.exports = router;
