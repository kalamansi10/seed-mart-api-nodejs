const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  plant_type: { type: String, required: true, maxLength: 100 },
  growing_season: { type: String, required: true, maxLength: 100 },
  seed_varieties: { type: String, required: true, maxLength: 100 },
  planting_location: { type: String, required: true, maxLength: 100 },
  special_attributes: { type: String, required: true, maxLength: 100 },
  planting_method: { type: String, required: true, maxLength: 100 },
  package_size: { type: String, required: true, maxLength: 100 },
  planting_location: { type: String, required: true, maxLength: 100 },
  price: { type: String, required: true, maxLength: 100 },
  tags: { type: String, required: true, maxLength: 500 },
  image_links: { type: Array, required: true, maxLength: 100, default: ["https://placehold.co/600x400", "https://placehold.co/400x600", "https://placehold.co/400x400", "https://placehold.co/600x600"] },
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date, required: true, default: Date.now },
});

ItemSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

module.exports = mongoose.model("Item", ItemSchema);

