const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
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
    reviewer: {
      type: String,
    },
    is_anonymous: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

reviewSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

reviewSchema.virtual("created_at").get(function () {
  return this.createdAt;
});

reviewSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Review", reviewSchema);
