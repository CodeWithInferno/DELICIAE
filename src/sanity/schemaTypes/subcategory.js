// export default {
//   name: "subcategory",
//   title: "Subcategory",
//   type: "document",
//   fields: [
//     {
//       name: "name",
//       title: "Subcategory Name",
//       type: "string",
//       validation: (Rule) => Rule.required(),
//     },
//     {
//       name: "slug",
//       title: "Slug",
//       type: "slug",
//       options: { source: "name", maxLength: 96 },
//     },
//     {
//       name: "parentCategory",
//       title: "Parent Category",
//       type: "reference",
//       to: [{ type: "productCategory" }], // Updated reference
//     },
//   ],
// };

export default {
  name: "subcategory",
  title: "Subcategory",
  type: "document",
  fields: [
    { name: "name", title: "Subcategory Name", type: "string", validation: (Rule) => Rule.required() },
    { name: "slug", title: "Slug", type: "slug", options: { source: "name", maxLength: 96 } },
    { name: "parentCategory", title: "Parent Category", type: "reference", to: [{ type: "productCategory" }] },
  ],
};
