// schemas/header.js
export default {
  name: "header",
  title: "Header Configuration",
  type: "document",
  fields: [
    {
      name: "logoText",
      title: "Logo Text",
      type: "string",
      initialValue: "DELICIAE",
    },
    {
      name: "logoImage",
      title: "Logo Image (optional)",
      type: "image",
      description: "Upload a logo image instead of using text.",
    },
    {
      name: "navItems",
      title: "Navigation Items",
      type: "array",
      of: [
        {
          type: "object",
          name: "navItem",
          title: "Navigation Item",
          fields: [
            {
              name: "title",
              title: "Menu Title",
              type: "string",
              description: 'Example: "Women", "Men", "Collections", "About"',
            },
            {
              name: "slugLink",
              title: "Menu Link",
              type: "string",
              description: "Link for menu item (e.g., '/about', '/men')",
            },
            {
              name: "hasMegaMenu",
              title: "Has Mega Menu?",
              type: "boolean",
              initialValue: false,
            },
            {
              name: "megaMenu",
              title: "Mega Menu",
              type: "object",
              hidden: ({ parent }) => !parent?.hasMegaMenu,
              fields: [
                {
                  name: "megaMenuTitle",
                  title: "Mega Menu Title",
                  type: "string",
                },
                {
                  name: "categories",
                  title: "Categories",
                  type: "array",
                  of: [
                    {
                      type: "object",
                      fields: [
                        {
                          name: "title",
                          title: "Category Title",
                          type: "string",
                        },
                        {
                          name: "slugLink",
                          title: "Category Link",
                          type: "string",
                          description: "URL or slug (e.g. '/women/new-arrivals').",
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "accessories",
                  title: "Accessories",
                  type: "array",
                  of: [
                    {
                      type: "object",
                      fields: [
                        {
                          name: "title",
                          title: "Accessory Title",
                          type: "string",
                        },
                        {
                          name: "slugLink",
                          title: "Accessory Link",
                          type: "string",
                          description: "URL or slug (e.g. '/women/handbags').",
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "featuredProducts",
                  title: "Featured Products",
                  type: "array",
                  of: [
                    {
                      type: "reference",
                      to: [{ type: "product" }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
