const express = require('express');
const router = express.Router();
const Admin = require('../models/admin');


router.get('/allAdmins', async (req, res) => {
    try {
        const admins = await Admin.find();
        res.json(admins);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching admins' });
    }
});


router.post('/addAdmin', async (req, res) => {
    const existing = await Admin.findOne({ code: req.body.code });
    if(existing) {
        return res.json({ success: false, message: 'Admin already exists!' });
    }
    const admin = new Admin(req.body);
    await admin.save();
    res.json({ success: true, message: 'Admin added!', admin });
});


router.put('/updateAdmin/:code', async (req, res) => {
    const updated = await Admin.findOneAndUpdate(
        { code: Number(req.params.code) },
        req.body,
        { new: true }
    );
    if(!updated) {
        return res.json({ success: false, message: 'Admin not found!' });
    }
    res.json({ success: true, message: 'Admin updated!', admin: updated });
});


router.delete('/delAdmin/:code', async (req, res) => {
    const deleted = await Admin.findOneAndDelete({ code: Number(req.params.code) });
    if(!deleted) {
        return res.json({ success: false, message: 'Admin not found!' });
    }
    res.json({ success: true, message: 'Admin deleted!', admin: deleted });
});

module.exports = router;