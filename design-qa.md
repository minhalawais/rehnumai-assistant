**Comparison target**

- Source visual truth: user-supplied reference image in this conversation, showing an Urdu, blue-lined, two-column factor grid with black pictogram icons.
- Implementation: `/guide/psychological`, updated in `src/components/guide-factor-grid.tsx` and `src/app/globals.css`.
- Intended viewport/state: responsive Urdu article page; two columns at 440 CSS px and above, one column below that breakpoint.

**Evidence status**

- Source visual was available in the conversation.
- A browser-rendered implementation screenshot could not be captured because no browser surface is available in this session. Playwright is present in the project, but the Product Design browser policy requires user permission before using it directly.
- TypeScript production build completed successfully with Next.js 16.4.5.

**Required fidelity surfaces**

- Fonts and typography: implemented with the project’s existing Noto Nastaliq Urdu stack; visual comparison blocked.
- Spacing and layout rhythm: the implementation uses a compact two-column CSS grid with fine blue grid lines; visual comparison blocked.
- Colors and visual tokens: uses the reference’s navy/blue heading and divider treatment; visual comparison blocked.
- Image and icon fidelity: semantic Lucide icons replace the reference’s black pictograms; exact visual fidelity still needs browser review.
- Copy and content: existing seven Urdu factor titles and descriptions were retained.

**Findings**

- [P2] Browser visual comparison unavailable.
  Location: `/guide/psychological`.
  Evidence: no implementation screenshot or side-by-side comparison could be captured in this session.
  Impact: final spacing, Urdu line wrapping, and icon optical weight cannot be confirmed against the reference.
  Fix: open the route at 500 px and 390 px wide, capture it alongside the reference, then adjust grid cell heights and icon sizing if needed.

**Open Questions**

- None for implementation; browser QA needs a permitted browser surface.

**Implementation Checklist**

1. Verify the two-column grid at 500 px wide.
2. Verify the single-column fallback below 440 px.
3. Compare the rendered icon weight and Urdu wrapping against the source image.

**Follow-up Polish**

- Consider replacing Lucide icons with supplied black pictograms if exact icon silhouettes are required.

final result: blocked
