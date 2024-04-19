const mongoose = require("mongoose");

const paymentMethodSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    payment_type: {
      type: String,
      required: true,
    },
    account_name: {
      type: String,
      required: true,
    },
    card_number: {
      type: String,
    },
    expiry_date: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

paymentMethodSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

paymentMethodSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("PaymentMethod", paymentMethodSchema);
