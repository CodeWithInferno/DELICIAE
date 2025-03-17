export default {
    name: "brand",
    title: "Brand / Designer",
    type: "document",
    fields: [
      {
        name: "name",
        title: "Brand Name",
        type: "string",
        validation: (Rule) => Rule.required(),
      },
      {
        name: "logo",
        title: "Brand Logo",
        type: "image",
      },
      {
        name: "description",
        title: "Brand Description",
        type: "text",
      },
      {
        name: "website",
        title: "Official Website",
        type: "url",
      },
    ],
  }
  