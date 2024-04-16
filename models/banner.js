const mongoose = require("mongoose");

// Define the schema for the banner
const bannerSchema = new mongoose.Schema(
  {
    banner_name: { type: String, required: true },
    image_link: { type: String, required: true },
    banner_link: { type: String, required: true },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

bannerSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

bannerSchema.set("toJSON", {
  virtuals: true,
});

// Create a model based on the schema
const Banner = mongoose.model("Banner", bannerSchema);

module.exports = Banner;
