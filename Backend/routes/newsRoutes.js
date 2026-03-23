const express = require('express');
const router = express.Router();
const News = require('../models/news');


// جيب كل الأخبار
router.get('/allnews', async (req, res) => {
    const news = await News.find();
    res.json(news);
});

// خبر واحد
router.get('/new/:id', async (req, res) => {
    const news = await News.findById(req.params.id);
    res.json(news);
});

// ضيف خبر جديد (قديم)
router.post('/add', async (req, res) => {
    const { title, description, date } = req.body;
    const news = new News({ title, description, date });
    await news.save();
    res.json({ success: true, message: 'News added!' });
});

// عدّل خبر (قديم)
router.put('/update/:id', async (req, res) => {
    const { title, description, date } = req.body;
    await News.findByIdAndUpdate(req.params.id, { title, description, date });
    res.json({ success: true, message: 'News updated!' });
});

// احذف خبر (قديم)
router.delete('/delete/:id', async (req, res) => {
    await News.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'News deleted!' });
});

//for admins

// GET جميع الأخبار (نفس القديم لكن قد نحتاج ترتيب)
router.get('/admin/all', async (req, res) => {
    try {
        const news = await News.find().sort({ date: -1 });
        res.json(news);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST خبر جديد مع دعم published
router.post('/admin/add', async (req, res) => {
    try {
        const news = new News(req.body);
        await news.save();
        res.status(201).json(news);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT تحديث خبر مع دمج
router.put('/admin/:id', async (req, res) => {
    try {
        const news = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(news);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE خبر
router.delete('/admin/:id', async (req, res) => {
    try {
        await News.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;