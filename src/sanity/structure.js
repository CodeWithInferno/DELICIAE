

export const structure = (S) =>
  S.list()
    .title('Content Management')
    .items([
      S.listItem()
        .title('Products')
        .child(S.documentTypeList('product').title('Products')),

      S.listItem()
        .title('Categories')
        .child(S.documentTypeList('productCategory').title('Product Categories')),

      S.listItem()
        .title('Subcategories')
        .child(S.documentTypeList('subcategory').title('Subcategories')),

      S.listItem()
        .title('Brands')
        .child(S.documentTypeList('brand').title('Brands')),

      S.listItem()
        .title('Collections')
        .child(S.documentTypeList('collection').title('Fashion Collections')),

      S.listItem()
        .title('Inventory')
        .child(S.documentTypeList('inventory').title('Inventory Management')),

      S.listItem()
        .title('Reviews')
        .child(S.documentTypeList('review').title('Customer Reviews')),

      S.listItem()
        .title('Lookbook')
        .child(S.documentTypeList('lookbook').title('Lookbook / Editorial')),

      S.listItem()
        .title('Banners')
        .child(S.documentTypeList('banner').title('Banners')),

      

      S.divider(),

      // Dynamically list any other document types that are not explicitly defined above
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() &&
          ![
            'product',
            'productCategory',
            'subcategory',
            'brand',
            'banner',
            'collection',
            'inventory',
            'review',
            'lookbook',
          ].includes(item.getId())
      ),
    ]);

export default structure;
