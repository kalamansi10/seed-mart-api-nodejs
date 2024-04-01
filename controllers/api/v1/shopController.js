const asyncHandler = require("express-async-handler");
const Item = require("../../../models/item");

exports.search = async (req, res) => {
  try {
    // Extract query parameters
    const keyword = req.query.keyword.toLowerCase();
    const offset = parseInt(req.query.offset) || 0; // Convert offset to integer, default to 0 if not provided

    // Build query to filter items based on keyword
    const query = { tags: { $regex: new RegExp(keyword, 'i') } };

    // Fetch items based on query and apply pagination
    const item_list = await Item.find(query)
                                .limit(20)
                                .skip(offset)
                                .lean(); // Convert documents to plain JavaScript objects

    const mappedItems = item_list.map(item => {
      return item_details(item);
    });
                                     
    // Get total count of items
    const itemCount = await Item.countDocuments(query);

    // Send response
    res.json({ item_list: mappedItems, item_count: itemCount});
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Extract details for each item
function item_details(item) {
  return {
    id: item._id.toString(),
    name: item.name,
    price: item.price,
    preview_image: item.image_links ? item.image_links[0] : null,
    items_sold: 0
    // items_sold: item.orders.filter(order => order.status === 'received').length
  };
}

// class Api::V1::ShopController < ApplicationController
//   # GET /api/v1/search
//   def search
//     keyword = params[:keyword].downcase
//     offset = params[:offset]

//     # Filter items based on keyword and additional filters
//     item_list = item_sorter(item_filter(price_filter(Item)))
//                 .where("tags LIKE ?", "%#{keyword}%")

//     render json: {
//       item_list: item_list.limit(20)
//                           .offset(offset)
//                           .map { |item| item_details(item) },
//       item_count: item_list.count
//     }
//   end

//   # GET /api/v1/active_banners
//   def active_banners
//     # Retrieve active banners
//     render json: Banner.where(is_active?: true)
//   end

//   # GET /api/v1/get_item/:item_id
//   def get_item
//     # Retrieve details of a specific item
//     render json: Item.get(params[:item_id])
//   end

//   # GET /api/v1/items_properties
//   def items_properties
//     filters = Item.column_names - ["id", "name", "price", "items_sold", "tags", "image_links", "created_at", "updated_at"]
//     # Retrieve distinct property values for items
//     render json: filters.map { |attribute| [attribute, Item.distinct.pluck(attribute)] }.to_h
//   end

//   private

//   # Sorts item list
//   def item_sorter(item_list)
//     case params[:sort_by]
//     when nil
//       return item_list.order(created_at: :desc)
//     when "price-lowest"
//       return item_list.order(price: :asc)
//     when "price-highest"
//       return item_list.order(price: :desc)
//     end
//   end

//   # Apply additional filters to the item list
//   def item_filter(item_list)
//     return item_list if params[:filter].blank?

//     params[:filter].each do |k, v|
//       item_list = item_list.where(k => v)
//     end

//     item_list
//   end

//   # Apply price range filter to the item list
//   def price_filter(item_list)
//     item_list = item_list.where("price >= ?", params[:minimum]) unless params[:minimum].blank?
//     item_list = item_list.where("price <= ?", params[:maximum]) unless params[:maximum].blank?
//     item_list
//   end

//   # Extract details for each item
//   def item_details(item)
//     {
//       id: item.id,
//       name: item.name,
//       price: item.price,
//       preview_image: item.image_links[0],
//       items_sold: item.orders.where(status: 'received').count
//     }
//   end
// end