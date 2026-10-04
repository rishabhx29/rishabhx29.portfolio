// Re-exported from the `cn` package so components have a single import site.
// Kept as a named re-export (rather than importing `cn` directly in every
// component) so the underlying implementation can be swapped without touching
// call sites.
export { cn } from "cn";
