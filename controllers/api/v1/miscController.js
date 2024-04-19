const Banner = require("../../../models/banner"); // Import Banner model

// GET /api/v1/activeBanners
exports.getActiveBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ is_active: true });
    res.json(banners);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET /api/v1/itemsProperties - needs to be improved
exports.getItemProperties = async (req, res) => {
  try {
    const filters = Object.keys(Item.schema.paths).filter(
      (attribute) =>
        ![
          "_id",
          "name",
          "price",
          "tags",
          "image_links",
          "createdAt",
          "updatedAt",
          "__v",
        ].includes(attribute)
    );
    const properties = await Promise.all(
      filters.map(async (attribute) => {
        return [attribute, await Item.distinct(attribute)];
      })
    );
    res.json(Object.fromEntries(properties));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
