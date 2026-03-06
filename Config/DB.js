// وظيفته ؟ الملف ده هيبقي فيه الكود الي بيعمل 
// Connection بتاع ال MongoDB Altas
// ليه ؟ علشان لو حبيت اغير الداتا بيز في المستقبل اغيرها من مكان واحد بس 

const mongoose = require('mongoose');

const connectDB = async () => {

    try {

        const conn = await mongoose.connect("mongodb+srv://me562697_db_user:KCPlhOWMHb2QiNWz@cluster0.dlyjejk.mongodb.net/?appName=Cluster0");

        console.log('MongoDB Connected');

    } catch (error) {

        console.error('Error: ' + error.message);

        process.exit(1);
    }
};

module.exports = connectDB;