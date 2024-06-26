const Review = require("../../../models/review");

// Get /api/v1/review/list/:item_id
exports.getReviewList = async (req, res) => {
  try {
    const reviews = await Review.find({ item: req.params.item_id })
      .sort({ createdAt: "desc" })
      .populate("user", "name");

    const formattedReviews = reviews.map((review) => ({
      ...review.toJSON(),
      reviewer: review.is_anonymous ? "Anonymous" : review.user.name,
    }));

    res.json(formattedReviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get /api/v1/review/:order_id
exports.getReview = async (req, res) => {
  try {
    const review = await Review.findOne({ order: req.params.order_id });
    res.json(review);
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
  console.log(req.params)
  console.log(req.body.review)
  try {
    await Review.findOneAndUpdate(
      { _id: req.params.review_id },
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
    is_anonymous: review.is_anonymous,
  };
}
