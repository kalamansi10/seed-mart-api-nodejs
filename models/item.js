const mongoose = require('mongoose');

// Define the schema for the item
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  plant_type: String,
  growing_season: String,
  seed_varieties: String,
  planting_location: String,
  special_attributes: String,
  planting_method: String,
  package_size: String,
  price: { type: Number, required: true },
  tags: { type: String, required: true },
  image_links: { 
    type: [String], 
    default: [
      "https://placehold.co/600x400",
      "https://placehold.co/400x600",
      "https://placehold.co/400x400",
      "https://placehold.co/600x600"
    ]
  }
}, { timestamps: true });

itemSchema.virtual("id").get(function () {
  return this._id.toHexString()
});

itemSchema.set("toJSON", {
  virtuals: true
})

// Create a model based on the schema
const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
