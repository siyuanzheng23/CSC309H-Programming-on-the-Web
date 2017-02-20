var mongoose = require('mongoose');

// Doc for Mongoose Schemas: http://mongoosejs.com/docs/guide
var Schema = mongoose.Schema;

/**
 * Note that the database was loaded with data from a JSON file into a
 * collection called gillers.
 */
var bookSchema = new Schema(
    {
        title: {
            type: String, required: true
        },
        author: {
            type: String, requried: true
        },
        isbn: {
            type: String, required: true, unique: true
        },
        likes: {
            type: Number, default: 0
        }
    },
    {
        collection: 'books'
    }
);

// Doc for Mongoose Connections: http://mongoosejs.com/docs/connections
mongoose.connect('mongodb://localhost/booksdb');

// Doc for Mongoose Models: http://mongoosejs.com/docs/models
module.exports = mongoose.model('Book', bookSchema);
