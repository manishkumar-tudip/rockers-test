var mongoose = require('mongoose');

// Create the ClothSchema.
var ClothSchema = new mongoose.Schema({
  cloth: {
    type: String,
    required: true
  }
});

// Export the model.
module.exports = mongoose.model('clothings', ClothSchema);
