export default {
    name: "inventory",
    title: "Inventory",
    type: "document",
    fields: [
      {
        name: "product",
        title: "Product",
        type: "reference",
        to: [{ type: "product" }],
      },
      {
        name: "size",
        title: "Size",
        type: "string",
      },
      {
        name: "color",
        title: "Color",
        type: "string",
      },
      {
        name: "stock",
        title: "Stock Quantity",
        type: "number",
        validation: (Rule) => Rule.min(0),
      },
    ],
  }
  