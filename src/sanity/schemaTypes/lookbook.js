export default {
    name: "lookbook",
    title: "Lookbook / Editorial",
    type: "document",
    fields: [
      {
        name: "title",
        title: "Lookbook Title",
        type: "string",
      },
      {
        name: "season",
        title: "Season",
        type: "string",
      },
      {
        name: "year",
        title: "Year",
        type: "number",
      },
      {
        name: "products",
        title: "Featured Products",
        type: "array",
        of: [{ type: "reference", to: [{ type: "product" }] }],
      },
      {
        name: "coverImage",
        title: "Cover Image",
        type: "image",
      },
    ],
  }
  