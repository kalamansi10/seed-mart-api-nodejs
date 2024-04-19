const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    order_reference: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    review: {
      type: Object,
      required: false,
    },
    shipping_address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShippingAddress",
      required: true,
    },
    payment_method: {
      type: String,
      ref: "PaymentMethod",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    adjustments: {
      type: Object,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

orderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

orderSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Order", orderSchema);
