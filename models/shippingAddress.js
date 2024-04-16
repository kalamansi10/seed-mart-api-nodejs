const mongoose = require("mongoose");

const shippingAddressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contact_name: {
      type: String,
      required: true,
    },
    street_address: {
      type: String,
      required: true,
    },
    barangay: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    is_main: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

shippingAddressSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

shippingAddressSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("ShippingAddress", shippingAddressSchema);
