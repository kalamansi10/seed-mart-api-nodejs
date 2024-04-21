const Item = require("../../../models/item"); // Import Item model
const Review = require("../../../models/review"); // Import Review model
const Order = require("../../../models/order"); // Import Order model

// GET /api/v1/search
exports.searchItems = async (req, res) => {
  try {
    const query = req.query;
    const keyword = query.keyword.toLowerCase();
    const offset = Number(query.offset) || 0;
    const limit = offset + 20;

    let itemList = Item.find({ tags: { $regex: new RegExp(keyword, "i") } });

    if (query.filter) itemList = itemList.where(query.filter); // Add filter by category
    if (query.minimum)
      itemList = itemList.where({ price: { $gte: query.minimum } }); // Minimum price
    if (query.maximum)
      itemList = itemList.where({ price: { $lte: query.maximum } }); // Maximum price

    itemList = itemSorter(itemList, query.sort_by);
    let item_list = await itemList.exec();
    const item_count = item_list.length; // Item count before mapping and slicing

    // Map each item to item_details
    item_list = item_list.map((item) => itemDetails(item));
    item_list = item_list.slice(offset, limit);
    for (let item of item_list) {
      const itemSold = await getItemSold(item.id)
      if (itemSold) item.item_sold = itemSold
      const averageRating = await getAverageRating(item.id)
      if (averageRating) item.rating = averageRating
    }

    res.json({ item_list, item_count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET /api/v1/getItem/:item_id - will update placeholder fields
exports.getItem = async (req, res) => {
  try {
    const itemId = req.params.item_id
    const averageRating = await getAverageRating(itemId)
    const itemSold = await getItemSold(itemId)
    const item = await Item.findById(itemId).lean();
    res.json({
      ...item,
      id: item._id,
      average_rating: 5,
      average_rating: averageRating || 0,
      item_sold: itemSold || 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Helper function to add sorting on query object
function itemSorter(itemList, sort_by) {
  switch (sort_by) {
    case "price-lowest":
      return itemList.sort({ price: 1 });
    case "price-highest":
      return itemList.sort({ price: -1 });
    default:
      return itemList.sort({ createdAt: -1 });
  }
}

// Helper function to extract details for each item
function itemDetails(item) {
  return {
    id: item._id.toString(),
    name: item.name,
    price: item.price,
    preview_image: item.image_links ? item.image_links[0] : null,
  };
}

// Helper function to extract details for each item
async function getItemSold(itemId) {
  const itemSold = await Order.countDocuments({ item: itemId });
  return itemSold;
}

// Helper function to extract details for each item
async function getAverageRating(itemId) {
  const reviews = await Review.find({ item: itemId });
  const totalReviews = reviews.length;
  const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
  return totalRating / totalReviews;
}