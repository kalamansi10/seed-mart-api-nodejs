const CartedItem = require("../../../models/cartedItem"); // Import CartedItem model

// GET /api/v1/get-cart
exports.getCart = async (req, res) => {
  try {
    const cartedItems = await CartedItem.find({ user: req.user.id })
      .sort({ created_at: "desc" })
      .populate("item");
    res.json(cartedItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/v1/get-for-checkout
exports.getForCheckout = async (req, res) => {
  try {
    const cartedItems = await CartedItem.find({
      user: req.user.id,
      is_for_checkout: true,
    })
      .sort({ created_at: "desc" })
      .populate("item");
    res.json(cartedItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/v1/update-carted-amount/:carted_id/:amount
exports.addToCart = async (req, res) => {
  const { item_id, amount } = req.query;

  if (!item_id || !amount) {
    return res.status(400).json({ message: "Item ID and amount are required" });
  }

  try {
    // Find the carted item for the current user and item ID
    let cartedItem = await CartedItem.findOne({
      user: req.user.id,
      item: item_id,
    });

    if (cartedItem) {
      // If the carted item exists, update the amount
      cartedItem.amount += parseInt(amount); // Increment the amount
      await cartedItem.save(); // Save the updated carted item
    } else {
      // If the carted item doesn't exist, create a new one
      cartedItem = await CartedItem.create({
        user: req.user.id,
        item: item_id,
        amount: parseInt(amount),
      });
    }
    res.status(200).json({ message: "Updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/v1/update-carted-amount/:carted_id/:amount
exports.updateCartedAmount = async (req, res) => {
  try {
    // Find the carted item
    let cartedItem = await CartedItem.findById(req.params.carted_id);
    if (!cartedItem) {
      return res.status(404).json({ message: "Carted item not found" });
    }

    cartedItem.amount = req.params.amount; // Change amount
    await cartedItem.save(); // Save the updated carted item
    res.status(200).json({ message: "Updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/v1/update-checkout-status/:carted_id/:is_for_checkout
exports.updateCheckoutStatus = async (req, res) => {
  try {
    // Find the carted item
    let cartedItem = await CartedItem.findById(req.params.carted_id);
    if (!cartedItem) {
      return res.status(404).json({ message: "Carted item not found" });
    }

    cartedItem.is_for_checkout = req.params.is_for_checkout; // Change status
    await cartedItem.save(); // Save the updated carted item
    res.status(200).json({ message: "Updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/v1/remove-from-cart/:carted_id
exports.removeFromCart = async (req, res) => {
  try {
    // Find the carted item and delete
    await CartedItem.findOneAndDelete(req.params.carted_id);
    res.json({ message: "Carted item removed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
