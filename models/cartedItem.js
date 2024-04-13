const mongoose = require("mongoose");

const cartedItemSchema = new mongoose.Schema(
  {
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
    amount: {
      type: Number,
      required: true,
    },
    is_for_checkout: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

cartedItemSchema.virtual("id").get(function () {
  return this._id.toHexString()
});

cartedItemSchema.set("toJSON", {
  virtuals: true
})

module.exports = mongoose.model("CartedItem", cartedItemSchema);
