export default {
    name: "review",
    title: "Product Review",
    type: "document",
    fields: [
      {
        name: "product",
        title: "Reviewed Product",
        type: "reference",
        to: [{ type: "product" }],
      },
      {
        name: "user",
        title: "User Name",
        type: "string",
      },
      {
        name: "rating",
        title: "Rating",
        type: "number",
        validation: (Rule) => Rule.min(1).max(5),
      },
      {
        name: "review",
        title: "Review Text",
        type: "text",
      },
    ],
  }
  