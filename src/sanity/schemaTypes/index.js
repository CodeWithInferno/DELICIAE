// // import { blockContentType } from './blockContentType'
// // import { categoryType } from './categoryType'
// // import { postType } from './postType'
// // import { authorType } from './authorType'

// // Import the new schemas
// import product from './product'
// import category from './category'
// import subcategory from './subcategory'
// import brand from './brand'
// import collection from './collection'
// import inventory from './inventory'
// import review from './review'
// import lookbook from './lookbook'

// export const schema = {
//   types: [
//     product,       
//     category,      
//     subcategory,
//     brand,        // ✅ Luxury brands & designers
//     collection,   // ✅ Fashion collections (Spring/Summer, Fall/Winter)
//     inventory,    // ✅ Stock tracking
//     review,       // ✅ Customer reviews & ratings
//     lookbook,     // ✅ Editorials & marketing campaigns
//   ],
// }






import product from "./product";
import productCategory from "./category";
import subcategory from "./subcategory";
import brand from "./brand";
import collection from "./collection";
import inventory from "./inventory";
import review from "./review";
import lookbook from "./lookbook";
import banner from "./banner.js";

export const schema = {
  types: [product, productCategory, subcategory, brand, collection, inventory, review, lookbook, banner],
};
