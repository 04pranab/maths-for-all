# AI Usage Disclosure

## Math for All

**Project:** Math for All
**Purpose:** A web-based educational game for basic mathematical literacy and inclusive learning.

**Copyright © 2026 Om Pranab Mohanty. All rights reserved.**

---

## 1. Use of Artificial Intelligence

Artificial intelligence tools were used during the development of **Math for All** as development and creative-assistance tools.

The primary AI systems used during development were:

* **OpenAI ChatGPT**
* **Anthropic Claude**

AI assistance was used to support parts of the development process, including:

* HTML, CSS, and JavaScript development
* Code generation and refinement
* Debugging and troubleshooting
* Identifying possible implementation issues
* Suggestions for user-interface and user-experience improvements
* Educational game mechanics and activity ideas
* Documentation and wording
* Reviewing and improving portions of the implementation

The use of AI tools does not mean that the AI systems are authors, copyright holders, or owners of this project.

---

## 2. Human Responsibility

All AI-generated or AI-assisted material was reviewed and integrated by the project author.

The final decisions regarding:

* software architecture;
* functionality;
* educational objectives;
* user experience;
* accessibility considerations;
* code integration;
* testing;
* documentation; and
* publication

were made by the project author.

AI-generated suggestions were not automatically accepted and may have been modified, rejected, or replaced during development.

The project author assumes responsibility for the final version of the Software.

---

## 3. AI Does Not Replace Testing

AI-generated code and recommendations may contain errors, omissions, security issues, accessibility problems, or inappropriate assumptions.

AI assistance should therefore not be interpreted as a guarantee that the Software is:

* error-free;
* secure;
* accessible to every learner;
* pedagogically validated;
* suitable for every educational context; or
* compliant with every applicable technical or legal requirement.

The Software should be independently reviewed and tested before being used in a particular educational environment.

---

## 4. Educational and Accessibility Considerations

Math for All is intended to support basic mathematical literacy and inclusive learning.

The project was developed with the intention of making mathematical learning more approachable for learners with diverse learning needs.

However, AI-assisted development does not constitute professional accessibility certification, educational validation, medical advice, therapeutic advice, or individualized educational assessment.

Teachers, educators, parents, caregivers, institutions, and other responsible users should determine whether the Software is appropriate for a particular learner or environment.

---

## 5. No AI Ownership

No AI system is being represented as an author or copyright holder of this project.

The use of ChatGPT, Claude, or other AI-assisted tools does not grant those systems, their providers, or their users ownership of the project.

Any applicable rights relating to third-party materials remain subject to their respective licenses and terms.

---

## 6. Third-Party AI Services

ChatGPT is provided by OpenAI.

Claude is provided by Anthropic.

This project is independent and is not affiliated with, endorsed by, or officially sponsored by OpenAI or Anthropic.

Product names and trademarks remain the property of their respective owners.

---

## 7. Transparency

This disclosure is provided to maintain transparency about the development process.

The presence of AI-assisted material should not be interpreted as a claim that the entire Software was generated automatically by artificial intelligence.

The project represents a human-directed development process in which AI tools were used as assistants during implementation and refinement.


---

## 8. Development Record

AI assistance has also been used as part of the documented engineering workflow for the v2.0.0 to v2.5.0 development line.

During the September 2026 development cycle, AI assistance was used for:

- reviewing the v2.0.0 release baseline;
- planning the v3 architecture and research-consent boundary;
- reviewing authentication and consent flows;
- identifying an analytics consent-enforcement gap before it was carried forward;
- hardening the research-consent UX;
- reviewing repository structure, documentation, and release planning;
- drafting and refining engineering documentation such as ONGOING.md;
- suggesting test cases, validation checks, and implementation improvements.

AI-assisted review was treated as engineering assistance rather than automatic approval. Repository changes were inspected before integration, and implementation decisions remained under the project author's control.

The project also records significant development milestones, pull requests, direct commits, releases, and planned work in ONGOING.md so that the development history remains understandable and auditable.

---


**Copyright © 2026 Om Pranab Mohanty. All rights reserved.**

**Project:** Math for All

**AI tools used:** OpenAI ChatGPT, Anthropic Claude

**License:** See [LICENSE](LICENSE)

## 9. September 25, 2026 Development Record

AI assistance was used to review and implement the separation of Log in and Sign up, username-or-email login handling, account-control presentation, longer Slab Maths progression, and associated repository documentation. Changes were reviewed before integration into the development branches.

## 10. September 25, 2026 Development Record

AI assistance was used to review the mobile layout and accessibility surface, then implement responsive controls, focus visibility, touch-friendly interactions, and reduced-motion support. Changes were reviewed before the PR was opened.

## 11. September 25, 2026 Development Record

AI assistance was used to implement the planned authentication/session hardening only: random session tokens, expiry, session validation, and invalid-session cleanup. No unrelated product features were added in PR #17.


## 12. September 25, 2026 Development Record

AI assistance was used to design and review the planned authentication/consent regression tests and browser stress checks. The test scope follows the v2.5.0 authentication milestone and includes session validation, strict research consent enforcement, login paths, repeated game transitions, static-resource checks, and runtime-error detection. No unrelated product functionality was added as part of the test work.


## 13. September 25, 2026 Development Record

The automated browser stress test identified a consent-gate binding issue and a missing favicon request. AI assistance was used to diagnose and review the fixes, while the changes were validated through the repository's automated syntax and browser stress workflow.


---

## September 25, 2026 · v2.0.1 Hardening Record

AI assistance was used to help review and implement the planned v2.0.1 hardening work.

The assistance covered:
- modal keyboard and focus behaviour;
- privacy-policy access for unauthenticated users;
- research-consent edge cases;
- stress-test expansion and failure analysis;
- documentation cleanup;
- license wording review;
- release metadata and changelog preparation.

Human responsibility remained with the project author. The final scope, privacy rules, legal wording, release decision, code integration, and testing decisions were reviewed before inclusion.

The project does not treat AI output as a security guarantee or legal opinion. Security findings are validated through executable tests and code review, and legal obligations remain governed by applicable law.


## 9. Visual asset assistance

AI assistance may be used to help sketch or refine small, dependency-free SVG decorations and CSS presentation ideas. Human review remains responsible for visual appropriateness, accessibility, licensing, performance, and final integration.

The repository keeps decorative SVG artwork local under assets/svg/ so the application does not depend on an external image CDN for this presentation layer.
