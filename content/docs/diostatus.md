---
title: "diostatus - The disclose.io Maturity Model"
description: "Recognition for early adopters and a clear path towards best practices."
weight: 50
---

## Let's send best practice viral!

Disclose.io Status provides recognition to early adopters of vulnerability disclosure programs, and a clear path towards best practices for those wanting to become more advanced.

![DIOstatus Maturity Model - The progression from Level 0 to Level 5](/uploads/discloseio-maturity-climb-v8.jpg)

## Plain-English Level Definitions

### Level 0 — Not Present

The organisation has no findable security contact, no security.txt, no disclosed policy, and no public intake method. A researcher discovering a vulnerability has no safe or sanctioned way to report it. From the ecosystem's perspective, this organisation is effectively invisible — or worse, implicitly hostile to disclosure.

### Level 1 — Contact Only

The organisation is findable and has a working intake method for security reports. This is typically evidenced by a `security.txt` file and/or a dedicated security contact (email, form, or URL). The bar is deliberately low — it just means a researcher can reach someone. There is no policy document, no legal commitment, and no defined process. But you exist, and you can be found.

### Level 2 — Basic VDP

There is an actual, publicly accessible document describing how the organisation wants vulnerabilities reported, plus a real communication channel to do it through. The intent is in writing. This is the minimum threshold to be considered a functioning Vulnerability Disclosure Program — but there are no legal protections for the researcher yet.

### Level 3 — Partial Safe Harbor

The policy makes a *promise* not to pursue legal action against researchers acting in good faith. The key word is promissory — language like "we will not pursue" or "we will not take legal action." This is where researcher protection begins. However, it stops short of explicitly *authorising* testing — think of it as "you're safe to report" rather than "you're safe to test." The protection is real but incomplete.

### Level 4 — Full Safe Harbor

The meaningful legal leap. The organisation doesn't just promise not to sue — it explicitly *grants permission* to test, and carves out exemptions from the specific laws that typically get researchers in trouble:

- Anti-hacking laws (CFAA, CMA, or equivalent)
- Anti-circumvention laws (DMCA, or equivalent)
- The organisation's own Terms of Service / AUP

Scope, compensation, communication channels, and disclosure process are all clearly defined. A researcher can point to this policy as a legal defence. This is the gold standard for researcher protection.

### Level 5 — Full Safe Harbor with CVD

Everything in Level 4, plus a proactive, public coordinated disclosure timeline — typically 90 days — with a defined process for adjusting it. This creates accountability on the organisation's side of the equation: researchers know that even if a vendor is slow to act, the vulnerability will eventually see daylight. It transforms the relationship from reactive to collaborative.

## Summary

| Level | Name | Key Signal | Researcher Protection |
|-------|------|------------|----------------------|
| 0 | Not Present | No contact, no policy | None |
| 1 | Contact Only | security.txt / intake method exists | None (but reachable) |
| 2 | Basic VDP | Public policy + channel | None (but documented) |
| 3 | Partial Safe Harbor | Won't pursue legal action | Partial — report safely |
| 4 | Full Safe Harbor | Explicitly authorises testing + law exemptions | Full — test safely |
| 5 | Full Safe Harbor + CVD | Level 4 + proactive disclosure timeline | Full + accountability |

## The Progression in One Line

**Findable → Communicating → Not hostile → Explicitly safe → Accountable**

Each level builds on the previous, creating a clear progression path for organizations to improve their vulnerability disclosure practices.
