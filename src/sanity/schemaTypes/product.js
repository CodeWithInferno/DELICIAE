// export default {
//     name: "product",
//     title: "Product",
//     type: "document",
//     fields: [
//       {
//         name: "title",
//         title: "Product Title",
//         type: "string",
//         validation: (Rule) => Rule.required(),
//       },
//       {
//         name: "slug",
//         title: "Slug",
//         type: "slug",
//         options: { source: "title", maxLength: 96 },
//       },
//       {
//         name: "description",
//         title: "Description",
//         type: "text",
//       },
//       {
//         name: "price",
//         title: "Price",
//         type: "number",
//         validation: (Rule) => Rule.min(0),
//       },
//       {
//         name: "categories",
//         title: "Categories",
//         type: "array",
//         of: [{ type: "reference", to: [{ type: "productCategory" }] }], // Updated reference
//     },
    
//       {
//         name: "subcategories",
//         title: "Subcategories",
//         type: "array",
//         of: [{ type: "reference", to: [{ type: "subcategory" }] }],
//       },
//       {
//         name: "variants",
//         title: "Variants",
//         type: "array",
//         of: [
//           {
//             type: "object",
//             fields: [
//               { name: "size", title: "Size", type: "string" },
//               { name: "color", title: "Color", type: "string" },
//               { name: "stock", title: "Stock", type: "number", validation: (Rule) => Rule.min(0) },
//             ],
//           },
//         ],
//       },
//       {
//         name: "images",
//         title: "Product Images",
//         type: "array",
//         of: [{ type: "image" }],
//         options: { layout: "grid" },
//       },
//       {
//         name: "isFeatured",
//         title: "Featured Product",
//         type: "boolean",
//       },
//       {
//         name: "seo",
//         title: "SEO",
//         type: "object",
//         fields: [
//           { name: "metaTitle", title: "Meta Title", type: "string" },
//           { name: "metaDescription", title: "Meta Description", type: "text" },
//         ],
//       },
//     ],
//   };








export default {
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Product Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
    },
    {
      name: "description",
      title: "Description",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading", value: "h2" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
          },
        },
      ],
    },
    {
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule) => Rule.min(0),
    },
    {
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "productCategory" }] }],
    },
    {
      name: "subcategories",
      title: "Subcategories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "subcategory" }] }],
    },
    {
      name: "variants",
      title: "Variants",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "color",
              title: "Color",
              type: "string",
            },
            {
              name: "sizes",
              title: "Sizes",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    { name: "size", title: "Size", type: "string" },
                    { name: "stock", title: "Stock Quantity", type: "number", validation: (Rule) => Rule.min(0) },
                  ],
                },
              ],
            },
            {
              name: "images",
              title: "Variant Images",
              type: "array",
              of: [{ type: "image" }],
              options: { layout: "grid" },
            },
          ],
        },
      ],
    },
    {
      name: "images",
      title: "Product Images",
      type: "array",
      of: [{ type: "image" }],
      options: { layout: "grid" },
    },
    {
      name: "isFeatured",
      title: "Featured Product",
      type: "boolean",
    },
    {
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        { name: "metaTitle", title: "Meta Title", type: "string" },
        { name: "metaDescription", title: "Meta Description", type: "text" },
      ],
    },
  ],
};
