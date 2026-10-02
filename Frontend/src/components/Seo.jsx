import useSeo from "@/hooks/useSeo";

/**
 * Declarative wrapper around the useSeo hook. Renders nothing.
 *
 * Placed once inside <Router> it keeps metadata in sync with every route.
 * Dynamic pages can render their own <Seo {...props} /> to override.
 */
export default function Seo(props) {
  useSeo(props);
  return null;
}
