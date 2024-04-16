const ShippingAddress = require("../../../models/shippingAddress");

// GET /api/v1/get-shipping-addresses
exports.getShippingAddress = async (req, res) => {
  try {
    const shippingAddresses = await ShippingAddress.find({
      user: req.user.id,
    }).sort({ createdAt: "desc" });
    res.json(shippingAddresses);
  } catch (error) {
    console.error("Error fetching shipping addresses", error);
    res.status(500).json({ message: "Error fetching shipping addresses" });
  }
};

// POST /api/v1/add-shipping-addresses
exports.addShippingAddress = async (req, res) => {
  try {
    const mainAddress = await ShippingAddress.findOne({
      user: req.user.id,
      is_main: true,
    });

    const newShippingAddress = new ShippingAddress({
      ...req.body.shipping_address,
      user: req.user.id,
    });

    if ((await newShippingAddress.save()) && mainAddress && req.body.shipping_address.is_main) {
      mainAddress.is_main = false;
      await mainAddress.save();
    }

    res.status(201).json({ message: "Shipping address added successfully" });
  } catch (error) {
    console.error("Error adding shipping address", error);
    res.status(500).json({ message: "Error adding shipping address" });
  }
};

// PUT /api/v1/update-shipping-addresses
exports.updateShippingAddress = async (req, res) => {};

// DELETE /api/v1/remove-shipping-address/:shipping_address_id
exports.removeShippingAddress = async (req, res) => {
  try {
    // Find the carted item and delete
    await ShippingAddress.findOneAndDelete(req.params.shipping_address_id);
    res.json({ message: "Shipping address removed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
