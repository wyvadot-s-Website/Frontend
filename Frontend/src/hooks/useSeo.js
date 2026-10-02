import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  DEFAULT_SEO,
  ROUTE_SEO,
  ORGANIZATION_JSONLD,
  absoluteUrl,
  isNoIndexPath,
} from "@/config/seo";

/** Upserts a <meta> tag, matching on `name` or `property` depending on key. */
function setMeta(key, value) {
  if (!value) return;

  const isProperty = key.startsWith("og:") || key.startsWith("article:");
  const selector = isProperty
    ? `meta[property="${key}"]`
    : `meta[name="${key}"]`;

  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(isProperty ? "property" : "name", key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", value);
}

/** Upserts a <link> tag by rel + href. */
function setLink(rel, href) {
  if (!href) return;

  let tag = document.head.querySelector(`link[rel="${rel}"]`);
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", rel);
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
}

/** Writes a JSON-LD block, reusing a single dedicated script tag. */
function setJsonLd(id, data) {
  const script = document.getElementById(id);
  if (!script || !data) return;
  script.textContent = JSON.stringify(data);
}

/**
 * Applies title, description, canonical, Open Graph, Twitter card and
 * structured data to the document.
 *
 * With no arguments it resolves metadata from the current route via
 * ROUTE_SEO. Pass an object to override it - useful for dynamic pages such as
 * /product/:id - the explicit props always win over the route defaults.
 */
export function useSeo(overrides) {
  const { pathname, search } = useLocation();

  const {
    title = DEFAULT_SEO.title,
    description = DEFAULT_SEO.description,
    image = DEFAULT_SEO.image,
    type = "website",
    noindex,
    jsonLd,
  } = overrides || {};

  // Route defaults are the baseline; explicit props take precedence.
  const routeSeo = ROUTE_SEO[pathname] || {};
  const resolvedTitle = overrides?.title ?? routeSeo.title ?? DEFAULT_SEO.title;
  const resolvedDescription =
    overrides?.description ?? routeSeo.description ?? DEFAULT_SEO.description;

  // Normalise the canonical path: drop query strings and collapse a trailing
  // slash so /about/ and /about do not become two canonical URLs.
  const canonicalPath = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  const canonical = absoluteUrl(canonicalPath);

  const shouldNoindex = noindex ?? isNoIndexPath(canonicalPath);

  useEffect(() => {
    document.title = resolvedTitle;

    setMeta("description", resolvedDescription);
    setMeta("robots", shouldNoindex ? "noindex, nofollow" : "index, follow");

    setLink("canonical", canonical);
    setLink("sitemap", "/sitemap.xml");

    setMeta("og:type", type);
    setMeta("og:url", canonical);
    setMeta("og:title", resolvedTitle);
    setMeta("og:description", resolvedDescription);
    setMeta("og:image", image);
    setMeta("og:image:alt", resolvedTitle);
    setMeta("og:site_name", "Wyvadot Projects & Resources Ltd");
    setMeta("og:locale", "en_US");

    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:url", canonical);
    setMeta("twitter:title", resolvedTitle);
    setMeta("twitter:description", resolvedDescription);
    setMeta("twitter:image", image);
    setMeta("twitter:image:alt", resolvedTitle);
    setMeta("twitter:creator", "@wyvadotpr");

    setJsonLd("seo-organization-jsonld", ORGANIZATION_JSONLD);
    if (jsonLd) setJsonLd("seo-page-jsonld", jsonLd);
    else document.getElementById("seo-page-jsonld")?.remove();
  }, [
    resolvedTitle,
    resolvedDescription,
    canonical,
    image,
    type,
    shouldNoindex,
    jsonLd,
    search,
  ]);
}

export default useSeo;
