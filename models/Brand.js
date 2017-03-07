var mongoose = require('mongoose');

// Create the BrandSchema.
var BrandSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true
  }
});
// Export the model.
module.exports = mongoose.model('brands', BrandSchema);
