import { describe, expect, it } from "vitest";
import {
  CONTRIBUTION_CALENDAR_QUERY,
  PULL_REQUEST_SEARCH_QUERIES,
  isAllowedQuery,
  normalizeQuery,
} from "./github-queries";

/**
 * These tests guard the security boundary on `/api/github`.
 *
 * That route holds the server-side GITHUB_TOKEN. Before the allowlist existed it
 * forwarded whatever `query` string a caller sent, so anyone who could reach it
 * could spend our rate-limit budget and read whatever the token can read. These
 * cases pin down the rejection behaviour so a future refactor can't quietly
 * reopen it.
 */

describe("isAllowedQuery", () => {
  it("accepts every query the site itself sends", () => {
    expect(isAllowedQuery(CONTRIBUTION_CALENDAR_QUERY)).toBe(true);

    for (const query of Object.values(PULL_REQUEST_SEARCH_QUERIES)) {
      expect(isAllowedQuery(query)).toBe(true);
    }
  });

  it("accepts an allowlisted query regardless of formatting", () => {
    const reformatted = `\n\n   ${CONTRIBUTION_CALENDAR_QUERY.replace(/\s+/g, "   ")}   \n`;

    expect(isAllowedQuery(reformatted)).toBe(true);
  });

  it("rejects an arbitrary client-supplied query", () => {
    expect(isAllowedQuery("{ viewer { login } }")).toBe(false);
  });

  it("rejects an allowlisted query with injected selection sets", () => {
    // The token can read private repos; a caller must not be able to ask for them.
    const injected = `${CONTRIBUTION_CALENDAR_QUERY} \n mutation { addStar(input: {}) { clientMutationId } }`;

    expect(isAllowedQuery(injected)).toBe(false);
  });

  it("rejects non-string payloads", () => {
    expect(isAllowedQuery(undefined)).toBe(false);
    expect(isAllowedQuery(null)).toBe(false);
    expect(isAllowedQuery({ query: CONTRIBUTION_CALENDAR_QUERY })).toBe(false);
    expect(isAllowedQuery(42)).toBe(false);
  });
});

describe("normalizeQuery", () => {
  it("collapses whitespace runs and trims", () => {
    expect(normalizeQuery("  a \n\t b   c  ")).toBe("a b c");
  });

  it("treats formatting-only differences as equal", () => {
    expect(normalizeQuery("query { user { login } }")).toBe(
      normalizeQuery("query {\n  user {\n    login\n  }\n}"),
    );
  });
});
