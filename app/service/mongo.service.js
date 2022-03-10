const mongoose = require('mongoose');

exports.connect = () => {
    // connecting to mongo database
    mongoose.connect(process.env.DB_URI, { useNewUrlParser: true ,useUnifiedTopology: true }, function (err) {
        if(err) {
            console.log(err);
        } else {
            console.log('Successfully connected to database.');
        }
    });
}