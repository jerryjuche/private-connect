export const APP_NAME = "PrivateConnect";
export const MAX_CONTACTS = 10;

export const ROUTES = {
  HOME: "/",
  ONBOARD: "/onboard",
  DISCOVER: "/discover",
  RESULTS: "/results",
  PROFILE: "/profile",
} as const;

export interface MockProfile {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar: string | null;
  wallet: string;
  joinedAt: string;
}

export interface UserProfile {
  username: string;
  email: string;
  avatar: string | null;
  isDiscoverable: boolean;
}

export type DiscoveryPhase =
  | "idle"
  | "normalizing"
  | "encrypting"
  | "submitting"
  | "processing"
  | "complete"
  | "failed";

export interface DiscoveryResult {
  matched: MockProfile[];
  total: number;
  hiddenCount: number;
}

export const MOCK_REGISTRY: Record<string, MockProfile> = {
  "bob@example.com": {
    id: "usr_bob",
    name: "Bob Nakamura",
    email: "bob@example.com",
    username: "bobnakamura",
    avatar: null,
    wallet: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAs",
    joinedAt: "2025-11-12",
  },
  "carol@example.com": {
    id: "usr_carol",
    name: "Carol Oduya",
    email: "carol@example.com",
    username: "caroloduya",
    avatar: null,
    wallet: "4mZ3uH9cN5pXqK2wYgRzLvTnJsFbDeWa1CiQoBhMtSE",
    joinedAt: "2025-12-03",
  },
  "dave@example.com": {
    id: "usr_dave",
    name: "Dave Eze",
    email: "dave@example.com",
    username: "daveeze",
    avatar: null,
    wallet: "9rP8sU3vT6mNkL7oAqYhCxBdFjGwZiEn2McHtRlQbKs",
    joinedAt: "2026-01-18",
  },
};

export const PHASE_META: Record<
  DiscoveryPhase,
  { label: string; detail: string }
> = {
  idle: {
    label: "Ready",
    detail: "Awaiting a new private discovery request.",
  },
  normalizing: {
    label: "Preparing inputs",
    detail:
      "Contacts are being normalized client-side before they enter the discovery flow.",
  },
  encrypting: {
    label: "Encrypting identifiers",
    detail:
      "The request payload is being transformed into a confidential matching input.",
  },
  submitting: {
    label: "Submitting request",
    detail:
      "The encrypted batch is being handed off to the discovery execution path.",
  },
  processing: {
    label: "Computing overlap",
    detail:
      "The system is resolving whether verified matches exist for this batch.",
  },
  complete: {
    label: "Result finalized",
    detail:
      "The requesting session can now render the confirmed overlap set.",
  },
  failed: {
    label: "Request failed",
    detail:
      "The request did not complete successfully. No contact identities were revealed.",
  },
};