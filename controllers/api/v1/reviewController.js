const Review = require("../../../models/review");

exports.getReviewList = async (req, res) => {
  try {
    const reviews = await Review.find({ item: req.params.item_id }).sort({
      createdAt: "desc",
    });
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// POST /api/v1/review
exports.addReview = async (req, res) => {
  try {
    const review = new Review({
      ...sanitizeReview(req.body.review),
      user: req.user.id,
    });
    await review.save();
    res.json({ message: "Review added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// PUT /api/v1/review
exports.editReview = async (req, res) => {
  try {
    await Review.findOneAndUpdate(
      { _id: req.body.review.id },
      { $set: sanitizeReview(req.body.review) }
    );
    res.json({ message: "Review updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// DELETE /api/v1/review/:review_id
exports.deleteReview = async (req, res) => {
  try {
    await Review.findOneAndDelete({ _id: req.params.review_id });
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Input sanitizer
function sanitizeReview(review) {
  return {
    item: review.item_id,
    order: review.order_id,
    rating: review.rating,
    comment: review.comment,
  };
}