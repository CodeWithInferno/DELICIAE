export default {
    name: "collection",
    title: "Fashion Collection",
    type: "document",
    fields: [
      {
        name: "name",
        title: "Collection Name",
        type: "string",
        validation: (Rule) => Rule.required(),
      },
      {
        name: "season",
        title: "Season",
        type: "string",
        options: {
          list: [
            { title: "Spring/Summer", value: "spring-summer" },
            { title: "Fall/Winter", value: "fall-winter" },
            { title: "Resort", value: "resort" },
          ],
        },
      },
      {
        name: "year",
        title: "Year",
        type: "number",
        validation: (Rule) => Rule.min(2000).max(new Date().getFullYear() + 2),
      },
      {
        name: "products",
        title: "Products in Collection",
        type: "array",
        of: [{ type: "reference", to: [{ type: "product" }] }],
      },
    ],
  }
  