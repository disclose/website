---
title: "Project Directory"
description: "The full ecosystem of disclose.io projects — standards, tools, data, and community resources for vulnerability disclosure."
weight: 90
---

disclose.io maintains an ecosystem of open-source projects that work together to make vulnerability disclosure safer and more accessible. Standards provide the legal and policy foundation, tools make adoption easy, data tracks progress across the internet, and community resources connect the people doing the work.

Everything below is free, open-source, and community-maintained.

## Standards and Templates

The policy and legal building blocks that underpin everything else.

### dioterms — VDP Policy Templates

The core set of boilerplate vulnerability disclosure policy templates. Available in multiple languages and adapted for specific geographies, verticals, and regulatory frameworks. These templates are what the Policymaker tool generates from.

[Repository](https://github.com/disclose/dioterms)

### dnssecuritytxt — DNS Security TXT

A proposed standard for publishing security contact and vulnerability disclosure information via DNS TXT records — extending the security.txt concept to organizations and assets where web-based paths aren't available.

[Repository](https://github.com/disclose/dnssecuritytxt)

### diostatus — The Maturity Model and Seal

A five-level maturity model for vulnerability disclosure programs, from "no contact" to "full safe harbor with coordinated disclosure." The disclose.io seal provides a recognizable mark indicating an organization's level of best-practice adoption. See the [full maturity model documentation](/docs/diostatus/).

[Repository](https://github.com/disclose/dioseal)

---

## Tools

Free tools that put the standards into practice.

### Policymaker

A multi-lingual, guided VDP policy generator. Answer a few questions about your organization and get a ready-to-publish vulnerability disclosure policy, safe harbor language, and security.txt — all based on the dioterms templates.

[policymaker.disclose.io](https://policymaker.disclose.io) | [Repository](https://github.com/disclose/policymaker)

### lookup.disclose.io

A security attribution and contact lookup tool. Given a domain, IP, package name, or other identifier, find the right place to report a vulnerability — pulling from security.txt, DNS, WHOIS, bug bounty platforms, and the disclose.io database.

[lookup.disclose.io](https://lookup.disclose.io) | [Repository](https://github.com/disclose/lookup.disclose.io)

### diosts — Security.txt Scanner

A Go-based scanner that validates security.txt files at internet scale. Powers the data behind the disclose.io VDP adoption surveys.

[Repository](https://github.com/disclose/diosts)

---

## Data and Research

Tracking adoption, documenting threats, and building the evidence base for policy work.

### diodb — The VDP/BBP Database

The definitive community-powered database of every known vulnerability disclosure program and public bug bounty program, along with their disclose.io maturity status. The most active project in the ecosystem — contributions welcome via pull request.

[Repository](https://github.com/disclose/diodb)

### data.disclose.io — VDP Adoption Survey

Internet-wide survey data on vulnerability disclosure program adoption, generated from diosts scans and community contributions. Used by researchers, policymakers, and organizations for tracking industry progress.

[data.disclose.io](https://data.disclose.io)

### research-threats — Legal Threats Archive

A structured archive of legal threats, cease-and-desist letters, and prosecutions targeting good-faith security researchers. Documents the chilling effect and provides evidence for policy advocacy.

[Repository](https://github.com/disclose/research-threats)

---

## Community and Content

Where the people are.

### The disclose.io Community

A forum for security researchers, program owners, and policy advocates. Get help with disclosure, find security contacts via Hacker Connect, and coordinate on policy responses.

[community.disclose.io](https://community.disclose.io)

### The Blog and PolicyPulse Newsletter

News, analysis, and the weekly PolicyPulse newsletter covering cybersecurity policy developments relevant to vulnerability disclosure.

[blog.disclose.io](https://blog.disclose.io)

### This Website

The documentation site you're reading now. Also open-source.

[Repository](https://github.com/disclose/website)

---

## Get Involved

disclose.io is open-source, not-for-profit, and volunteer-run. See [Open-source Contributors](/docs/open-source-contributors/) for ways to help, or [Join a Project](/docs/join-a-project/) to get started.
