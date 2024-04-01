const Item = require('../../../models/item'); // Import Item model
const Banner = require('../../../models/banner'); // Import Banner model

// GET /api/v1/search
exports.search = async (req, res) => {
  try {
    const query = req.query
    const keyword = query.keyword.toLowerCase();
    const offset = Number(query.offset) || 0;
    const limit = offset + 20;

    let itemList = Item.find({ tags: { $regex: new RegExp(keyword, 'i') } });
    
    if (query.filter) itemList = itemList.where(query.filter); // Add filter by category
    if (query.minimum) itemList = itemList.where({ price: {$gte: query.minimum}}); // Minimum price
    if (query.maximum) itemList = itemList.where({ price: {$lte: query.maximum}}); // Maximum price

    itemList = itemSorter(itemList, query.sort_by);
  
    let item_list = await itemList.exec()

    const item_count = item_list.length; // Item count before mapping and slicing

    // Map each item to item_details
    item_list = item_list.map(item => itemDetails(item));
    console.log(limit)
    item_list = item_list.slice(offset, limit);

    res.json({item_list, item_count});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET /api/v1/activeBanners
exports.activeBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ is_active: true });
    res.json(banners);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET /api/v1/getItem/:item_id - will update placeholder fields
exports.getItem = async (req, res) => {
  try {
    let item = await Item.findById(req.params.item_id).lean();
    res.json({...item, id: item._id, average_rating: 5, reviews: [], item_sold: 999});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET /api/v1/itemsProperties - needs to be improved
exports.itemsProperties = async (req, res) => {
  try {
    const filters = Object.keys(Item.schema.paths).filter(attribute => !["_id", "name", "price", "tags", "image_links", "createdAt", "updatedAt", "__v"].includes(attribute));
    const properties = await Promise.all(filters.map(async attribute => {
      return [attribute, await Item.distinct(attribute)];
    }));
    res.json(Object.fromEntries(properties));
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
    // items_sold: item.orders.filter(order => order.status === 'received').length
  };
}