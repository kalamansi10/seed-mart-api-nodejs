const crypto = require("crypto");
const Order = require("../../../models/order");

// POST /api/v1/order
exports.processOrder = async (req, res) => {
  try {
    const orderList = req.body.order_list;
    const referenceNumber = await generateReferenceNumber();

    for (let order of orderList) {
      const sanitizedOrder = sanitizeOrder(req, order);
      const createdOrder = await createOrder(referenceNumber, sanitizedOrder);
      if (!createdOrder) {
        throw new Error("Failed to create order");
      }
    }
    res
      .status(201)
      .json({
        message: "Orders processed successfully",
        reference_number: referenceNumber,
      });
  } catch (error) {
    console.error("Error processing order", error);
    res.status(500).json({ message: "Error processing order" });
  }
};

function sanitizeOrder(req, order) {
  return {
    user: req.user.id,
    item: order.item_id,
    shipping_address: order.shipping_address_id,
    payment_method: order.payment_method_id,
    amount: order.amount,
    adjustments: order.adjustments,
    total: order.total,
  };
}

async function createOrder(referenceNumber, order) {
  let newOrder = new Order({
    ...order,
    order_reference: referenceNumber,
    status: "Delivery attempt",
  });

  try {
    const savedOrder = await newOrder.save();
    return savedOrder;
  } catch (error) {
    console.error("Error creating order", error);
    return null;
  }
}

async function generateReferenceNumber() {
  let referenceNumber;

  do {
    const prefix = "SEED";
    const randomNumbers = crypto.randomBytes(5).toString("hex");
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");

    referenceNumber = `${prefix}${randomNumbers}${timestamp}`;

    // Check if an order with the generated reference number exists
    const existingOrder = await Order.findOne({
      order_reference: referenceNumber,
    });

    if (existingOrder) {
      // If order with the reference number exists, generate a new number
      continue;
    } else {
      // If no order with the reference number exists, break out of the loop
      break;
    }
  } while (true);

  return referenceNumber;
}
