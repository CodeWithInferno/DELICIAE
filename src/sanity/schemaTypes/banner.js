// schemas/banner.js
export default {
    name: "banner",
    title: "Banner",
    type: "document",
    fields: [
      {
        name: "title",
        title: "Banner Title",
        type: "string",
        validation: (Rule) => Rule.required(),
      },
      {
        name: "video",
        title: "Banner Video",
        type: "file",
        options: { accept: "video/mp4" },
      },
      {
        name: "image",
        title: "Banner Image",
        type: "image",
        options: { hotspot: true },
      },
      {
        name: "linkedCategory",
        title: "Linked Category",
        type: "reference",
        to: [{ type: "productCategory" }],
      },
      {
        name: "linkedSubcategory",
        title: "Linked Subcategory",
        type: "reference",
        to: [{ type: "subcategory" }],
      },
      {
        name: "description",
        title: "Description",
        type: "text",
      },
    ],
  };
  