export default {
  name: "productCategory",
  title: "Product Category",
  type: "document",
  fields: [
    { name: "name", title: "Category Name", type: "string", validation: (Rule) => Rule.required() },
    { name: "slug", title: "Slug", type: "slug", options: { source: "name", maxLength: 96 } },
  ],
};
