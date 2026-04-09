const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');


// جيب حالة التسجيل (للطلاب)
router.get('/status', auth, async (req, res) => {
    let settings = await Settings.findOne();
    if(!settings) {
        settings = await Settings.create({ registrationOpen: false });
    }
    res.json({ registrationOpen: settings.registrationOpen });
});

// عدّل حالة التسجيل (للأدمن فقط)
router.put('/updatestatus', auth, async (req, res) => {
    const { registrationOpen } = req.body;
    await Settings.findOneAndUpdate({}, { registrationOpen });
    res.json({ success: true });
});


// GET كل الإعدادات (للأدمن)
router.get('/all', auth, async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings();
            await settings.save();
        }
        res.json(settings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT تحديث كل الإعدادات (للأدمن)
router.put('/update', auth, async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings();
        }
        Object.assign(settings, req.body, { updatedAt: Date.now() });
        await settings.save();
        res.json(settings);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;