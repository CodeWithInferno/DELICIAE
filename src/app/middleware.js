// // app/middleware.js
// import { NextResponse } from "next/server";

// export function middleware(request) {
//   // 1. Detect user's country. Fallback to "us" if unavailable
//   const country = (request.geo?.country || "US").toLowerCase();
//   console.log("MIDDLEWARE HIT:", request.nextUrl.pathname);


//   // 2. Clone the URL so we can modify its path
//   const url = request.nextUrl.clone();

//   // 3. If the user is at the root "/", do nothing (landing page is universal)
//   if (url.pathname === "/") {
//     return NextResponse.next();
//   }

//   // 4. Define which country codes you support
//   const supportedCountries = ["us", "uk", "in", "de", "fr", "ca"];

//   // 5. Extract the first path segment (e.g. "/us/product" => "us")
//   const firstSegment = url.pathname.split("/")[1]?.toLowerCase();

//   // 6. If the first segment is already a supported country code, skip redirect
//   if (supportedCountries.includes(firstSegment)) {
//     return NextResponse.next();
//   }

//   // 7. Otherwise, redirect the user to: "/<country>/<original path>"
//   // e.g. if path was "/product/shoes", redirect to "/us/product/shoes"
//   url.pathname = `/${country}${url.pathname}`;
//   return NextResponse.redirect(url);
// }







// /middleware.js (Next.js 13+ App Router)
import { NextResponse } from "next/server";

export function middleware(request) {
  // 1. We want an always-lowercase two-letter code, fallback to "us"
  //    But we also allow forcing a country via '?forceCountry=xx'
  const url = request.nextUrl.clone();
  const forced = url.searchParams.get("forceCountry");  // e.g. ?forceCountry=uk
  let country = forced?.toLowerCase() || request.geo?.country?.toLowerCase() || "us";

  // 2. Define which country codes you actually support
  //    If country is not in the list, fallback to "us"
  const supportedCountries = ["us", "uk", "in", "de", "fr", "ca"];
  if (!supportedCountries.includes(country)) {
    country = "us";
  }

  // 3. If the user is on the root '/', do nothing (universal landing page)
  if (url.pathname === "/") {
    return NextResponse.next();
  }

  // 4. Grab the first path segment (pathname like '/product/shoes' => 'product')
  //    If it's already a supported country code, do nothing
  const firstSegment = url.pathname.split("/")[1]?.toLowerCase();
  if (supportedCountries.includes(firstSegment)) {
    return NextResponse.next();
  }

  // 5. Otherwise, we redirect to '/<country>/<original path>'
  //    e.g. '/product/shoes?forceCountry=uk' => '/uk/product/shoes'
  url.pathname = `/${country}${url.pathname}`;

  // We don't want ?forceCountry=xx to linger after redirect, so let's remove it
  url.searchParams.delete("forceCountry");

  // 6. Return a redirect
  return NextResponse.redirect(url);
}
