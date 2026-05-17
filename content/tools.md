---
title: "Tools"
description: "Free, open-source tools from the disclose.io project — for organizations launching a VDP, for researchers finding the right contact, and for everyone working to make vulnerability disclosure simpler."
tldr: "disclose.io maintains four free, open-source tools that cover the full disclosure lifecycle: Policymaker generates VDP policy text from canonical templates, Directory and Lookup help anyone find the right disclosure contact for any asset, and Vault cryptographically enforces disclosure deadlines so a committed timeline cannot be reversed."
---

The disclose.io project ships four tools — each free, each open-source, each addressing a specific friction in the vulnerability disclosure pipeline.

## Policymaker
**[policymaker.disclose.io](https://policymaker.disclose.io)** — Interactive policy generator

Generates a customized vulnerability disclosure policy (VDP) for any organization using the canonical legal terms from the [disclose.io Framework](/framework/). Pick a maturity level, fill in the organization name and contact channel, and walk away with safe-harbor language, a security.txt file, and a complete disclose.io-compliant policy.

## Directory
**[directory.disclose.io](https://directory.disclose.io)** — The open VDP and bug bounty programs database

Browse every known vulnerability disclosure and bug bounty program. Each entry includes the organization, in-scope assets, policy URL, and any safe-harbor language. Open-source, community-curated, and the data source behind the [Lookup](#lookup) attribution tool.

## Lookup
**[lookup.disclose.io](https://lookup.disclose.io)** — Security contact attribution

Turn any input — domain, IP, URL, email, ASN, npm package, mobile app, hardware product, free-text company name — into the right disclosure contact. The tool chains 11 attribution strategies (security.txt, the Directory, WHOIS, DNS SOA, common security@ aliases, bug bounty platform records, and more) and returns the highest-confidence contact with provenance. Available as a web UI, HTTP API, and MCP server.

## Vault
**[vault.disclose.io](https://vault.disclose.io)** — Cryptographically enforced disclosure deadlines

A dead-man's-switch for vulnerability disclosure. A researcher commits a disclosure with a future publication date; the disclosure is encrypted with a timelock that cannot be bypassed, even by the operators of the vault. On expiry, the disclosure becomes publicly readable — regardless of what happens to anyone involved.

## Browser extension
**[Chrome extension](https://chromewebstore.google.com/detail/discloseio/efelnoglhabpipbgneeoehjbcmiclpda)** *(also referenced as the Disclose extension)*

Surfaces the disclose.io directory's VDP posture for any site you visit — see at a glance whether the organization has a published VDP, what their safe-harbor language is, and where to report a vulnerability.

## Browse the source

Every tool is open-source under the [github.com/disclose](https://github.com/disclose) organization. Contributions, issue reports, and policy improvements all welcome.
