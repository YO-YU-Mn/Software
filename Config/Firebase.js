// وظيفته ؟ ده الي هيتحط فيه كود ال admin.initializeApp وانادي فيه علي ملف ال Firebase-key.json

const admin = require('firebase-admin');

const serviceAccount = require('./firebase-key.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

console.log('Firebase Admin Initialized!');

module.exports = admin;