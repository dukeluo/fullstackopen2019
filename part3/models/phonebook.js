const mongoose = require('mongoose');

const MONGODB_URL_DEV = 'mongodb://stack:stack@127.0.0.1:27017/fullstackopen2019'
const url = process.env.MONGODB_URL || MONGODB_URL_DEV;

console.log('connecting to', url);
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
}).then(result => {
    console.log('connected to MongoDB');
}).catch(error => {
    console.log('error connecting to MongoDB:', error.message);
});

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: Number,
});

phonebookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Phonebook', phonebookSchema);
