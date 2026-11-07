# Mobile UX decisions

The application is primarily used on phones by staff guiding an applicant. Mobile layouts therefore prioritize one task at a time, readable Urdu and English, clear consent, and a quick path back to an existing case. Desktop layouts retain their existing composition. Mobile-specific layout rules live inside the `max-width: 1023px` media query; the intake's existing six-step desktop form remains available at larger widths.

| View | Mobile behavior | Reason |
| --- | --- | --- |
| Public home | Compact hero, full-width booklet and staff actions, reduced secondary copy | Keeps the two real destinations obvious without making staff scroll through repeated explanations. |
| Sign in | Edge-to-edge form, larger fields and submit button, no decorative image on the narrow screen | Gives the keyboard and credentials enough room while keeping the photographic panel on desktop. |
| Access help and privacy | Compact article headings and comfortable line length | These pages are short reference content, so no extra cards or navigation layers are needed. |
| Booklet | Actual cover preview and direct open/download actions; desktop embedded reader remains | Browser PDF embeds are inconsistent on phones; the native PDF reader provides zoom and page navigation. |
| Overview | Two-column summary and concise recent case rows; persistent bottom navigation | Key workload and case entry points remain visible without a tall stack of metrics. |
| Cases | Search first, compact status/stage filters, scannable case rows and pagination | Staff can find a person or reference quickly and filter by work state. |
| Case detail | Next action before the record, compact summary, vertically stacked sections, bottom-sheet style action dialog | The next step is visible before the long record; restricted contact still requires deliberate reveal. |
| Intake | One question per view, conditional questions, progress, persistent Back/Continue, save and exit, resume by question ID, answer review before submission | Reduces form density on a phone while preserving server-backed drafts, consent, and review. |
| Intake completion/decline | Full-width receipt or guidance with one clear next action | Supports quick handoff after the conversation ends. |

The question flow asks for consent before personal details, branches around contact and employment details, permits a "prefer not to say" safety response, and calls out immediate danger with a safeguarding acknowledgment. The final review checks for unanswered required questions and requires staff attestation. Drafts omit unanswered stage/purpose fields so they can save successfully.

The approach follows [GOV.UK question page guidance](https://design-system.service.gov.uk/patterns/question-pages/) for focused questions, [GOV.UK check answers guidance](https://design-system.service.gov.uk/patterns/check-answers/) for review before submission, and [WCAG 2.2 target size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum) for usable touch controls. The mobile buttons and choice rows exceed the WCAG minimum target size. The implementation also supports reduced motion and visible keyboard focus.
