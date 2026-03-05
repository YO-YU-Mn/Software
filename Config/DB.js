// وظيفته ؟ الملف ده هيبقي فيه الكود الي بيعمل 
// Connection بتاع ال MongoDB Altas
// ليه ؟ علشان لو حبيت اغير الداتا بيز في المستقبل اغيرها من مكان واحد بس 

const mongoose = require('mongoose');

const connectDB = async () => {

    try {

        const conn = await mongoose.connect("mongodb://mongooedb_user:Azhx3OabzG2pQkan@clustertest.61uaejj.mongodb.net/?appName=ClusterTest");

        console.log('MongoDB Connected');

    } catch (error) {

        console.error('Error: ' + error.message);

        process.exit(1);
    }
};

module.exports = connectDB;