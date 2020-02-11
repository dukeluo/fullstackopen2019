require('dotenv').config();

let PORT = global.process.env.PORT;
let MONGODB_URL = global.process.env.MONGODB_URL;

if (global.process.env.NODE_ENV === 'test') {
    MONGODB_URL = global.__MONGO_URI__;
}

module.exports = {
    MONGODB_URL,
    PORT,
};