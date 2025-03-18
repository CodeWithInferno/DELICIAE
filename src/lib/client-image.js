import { createClient } from "next-sanity"
import imageUrlBuilder from '@sanity/image-url'

// Sanity client configuration
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2023-05-03",
  useCdn: true,
})

// Image URL builder setup
const builder = imageUrlBuilder(client)

// Helper function to get image URL from Sanity
export function getImageUrl(image) {
  if (!image || !image.asset) return null
  return builder.image(image).url()
}

// Fetch header data from Sanity
export async function fetchHeaderData() {
  try {
    return await client.fetch(`*[_type == "header"][0]`)
  } catch (error) {
    console.error("Error fetching header data:", error)
    return null
  }
}

// Fetch products from an array of Sanity references
export async function fetchProductsByRefs(refs) {
  if (!refs || refs.length === 0) return []

  try {
    const productIds = refs.map(ref => ref._ref)
    const query = `*[_type == "product" && _id in $productIds]`
    return await client.fetch(query, { productIds })
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}