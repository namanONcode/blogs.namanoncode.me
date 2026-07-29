---
name: ai-writing-signs
description: Use whenever text needs checking for signs of undisclosed AI/LLM authorship, or whenever Claude's own long-form writing should be self-audited before delivery so it doesn't read like generic AI output. Trigger on 'does this sound AI-written', 'check this draft for AI tells', 'was this written by ChatGPT', or before handing back substantial prose (articles, bios, reports, wiki-style entries). Covers content tells (undue emphasis on significance/legacy, notability-by-attribution, weasel wording), overused vocabulary ('delve', 'boasts', 'not just X but Y', rule-of-three lists), formatting artifacts (title-case headings, em-dash overuse, inline-header lists), leftover chatbot text (oaicite/turn0search/grok_card bugs, 'Certainly! Here's...', knowledge-cutoff disclaimers), and citation red flags, plus how to weigh weak signals together instead of treating any one as proof, and what does NOT indicate AI use.
---

# AI Writing Signs

Use this skill in two directions:

1. **Detect**: when asked whether a piece of text (an article, essay, email, Wikipedia draft, student paper, business document, etc.) shows signs of undisclosed AI/LLM authorship.
2. **Self-edit**: before delivering a substantial piece of your own writing (an article, bio, report, blog post, encyclopedia-style entry), run it past this checklist and strip out the tells so it reads like careful human writing rather than a template.

The checklist is adapted from Wikipedia's WikiProject AI Cleanup essay, [Wikipedia:Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing), which catalogs patterns found across thousands of real AI-assisted Wikipedia edits. Most of it generalizes to any long-form writing. A handful of items are Wikipedia-specific; those are marked as such in `references/detailed-signs.md`.

## Ground rules before flagging anything

Every item below is a weak, individually inconclusive signal. Never treat it as proof on its own.

- **One instance proves nothing.** A single em dash, a single "delve," one confident sentence is normal human variation. Look for a *cluster* of unrelated signs (vocabulary plus structure plus a leftover chatbot phrase) before concluding anything.
- **Humans, you included by default, are bad at this.** Blind judgment of AI vs. human text is close to a coin flip. Careful, systematic pattern-matching does meaningfully better, but still isn't certain.
- **The pattern is a symptom, not the disease.** These signs work as a smoke detector for deeper problems: unverified claims, synthesis, fabricated citations, promotional tone. Scrubbing the em dashes without checking whether the underlying facts are even true doesn't actually fix anything. If you're reviewing text for someone, name the real problem, not just which words to delete.
- **Some "tells" are just formal, older, or non-native English.** Curly quotes, Markdown formatting, or slightly stiff phrasing can come from professional editors, style guides, non-native speakers, or ordinary software (Word's "smart quotes," Markdown-native tools like Obsidian, Slack, or GitHub). Don't treat these alone as evidence.
- **Calibrate your language.** Say "shows several common signs of AI-assisted writing" rather than "this was written by AI," and never state it as certain. Describe the text, not a specific person's intent. A false accusation of AI use can badly damage someone's credibility.

## Category 1: Content-level tells

- **Undue significance/legacy framing.** Ordinary facts get inflated into historic turning points: "marked a pivotal moment," "a testament to its enduring legacy," "part of a broader shift toward X." Watch for this on mundane subjects (etymology, population counts, a minor local road) that no human writer would bother inflating.
- **Notability-by-attribution.** Instead of stating the fact, the text keeps pointing at the existence of coverage: "has been featured in national and regional media," "maintains an active social media presence," "independent coverage confirms." A human writer usually just states the fact, not the fact that it was covered.
- **Tacked-on superficial analysis.** A plain sentence gets a dangling "-ing" clause claiming unearned importance, e.g. "...further cementing its role as a cultural touchstone."
- **Weasel attribution.** Claims pinned on a vague authority ("industry observers note," "critics argue," "experts have highlighted"), especially when only one or two sources are actually cited, or none.
- **Formulaic "Challenges"/"Future Outlook" close.** A rigid section opening with "Despite its [positive framing], X faces several challenges" and ending on vague optimism or "ongoing efforts."
- **Treating a descriptive title as a proper noun.** "Catchment area (health) refers to..." or "List of X is a curated compilation of..." where a human editor would usually just describe the subject directly.
- **Ecology/biology padding.** For a species or place, boilerplate about "the broader ecosystem" and "ongoing conservation efforts" even when no such status or effort exists.
- **Promotional/travel-guide register.** "Nestled in the heart of," "boasts a vibrant and rich history," "a must-visit destination": advertising tone where neutral description is expected.

## Category 2: Language & vocabulary

- **Overused vocabulary**, clustering by "LLM era." Early ChatGPT-era text leaned on *delve, boasts, crucial, intricate, meticulous, tapestry, testament, underscore, vibrant, pivotal*. Mid-era text shifted toward *align with, fostering, enhance, showcasing, underscore, vibrant*. More recent output favors *emphasizing, enhance, highlighting, showcasing*. One or two of these is coincidence; several clustering in one passage is a real signal. Full era-by-era lists are in `references/detailed-signs.md`.
- **Avoiding a plain "is/are/has."** "Serves as," "stands as," "functions as," "boasts," "offers," "refers to" standing in for a plain copula: "The gallery serves as LAAA's exhibition space" instead of "The gallery is LAAA's exhibition space."
- **Negative parallelism.** "Not only X, but Y," "it's not just A, it's B": contrastive framing that's everywhere in AI output and comparatively rare in ordinary prose outside deliberate myth-busting listicles.
- **Rule of three.** Padding lists and descriptions into triples (three adjectives, three bolded sub-points, three clauses) to make a thin point look thorough.
- **Compulsive "elegant variation."** Switching between "the artist," "the creative," "this pioneering figure" for the same person across three consecutive sentences instead of just repeating the plain term, the way most human writing does.

## Category 3: Style & formatting

- **Title-cased headings.** "Impact of Technology and Digitalization" instead of sentence case.
- **Overuse of bold.** Bolding a key term every single time it recurs, "key takeaways" style, instead of reserving it for genuine emphasis.
- **Inline-header bullet lists in flowing prose.** "- **Term:** description" repeated down what should be a narrative paragraph. (Note: this format is completely normal in reference docs and READMEs, including this one. It's a tell specifically when it replaces prose that a human would have written as sentences, e.g. in an encyclopedia article body or a biography.)
- **Em dash overuse.** Dashes doing the work of commas, parentheses, or colons in nearly every paragraph, often with spaces around them (like this), where a human using dashes correctly usually skips the spaces.
- **Emoji as bullets or heading decoration** in otherwise plain reference text.
- **Skipped heading levels, or a divider before every heading.** Jumping straight to a sub-heading with nothing above it, or inserting a horizontal rule before each section: both artifacts of chatbot output that don't match the destination's actual conventions.
- **Curly quotes mixed inconsistently with straight ones** in the same passage (not conclusive alone; see ground rules).
- **Unnecessary small tables** for information that reads more naturally as a sentence or two.

## Category 4: Leftover chatbot/meta text

The strongest category. This isn't a style tic, it's the model talking to whoever prompted it, accidentally left in.

- **Conversational filler.** "Certainly! Here's a revised version," "I hope this helps!", "Would you like me to also...", "Let me know if you'd like a more detailed breakdown."
- **Explicit AI self-reference.** "As an AI language model, I can't directly...", "as of my last knowledge update...", "up to my training cutoff..."
- **Speculation dressed as fact.** "While specific details are limited in the available sources, X likely..." followed by a guess presented as a claim.
- **Unfilled template blanks.** Literal placeholder text like `[Insert name here]` or `2025-XX-XX` left in a date field.
- **Raw citation/tool artifacts.** Fragments like `oaicite`, `turn0search3`, `[cite: 1]`, `(start_span)...(end_span)`, `grok_card`, `utm_source=chatgpt.com`, lenticular-bracket citations, or `[attached_file:1]`. These are internal formatting from specific chatbot tools that leaked through in a copy-paste. There's no other plausible source for them, so treat these as close to conclusive. Full list in `references/detailed-signs.md`.

## Category 5: Citations & sourcing

- Several **broken external links** in one new document, none showing up in web archives either.
- **Book citations with no page number and no URL**, especially for a well-known or frequently-cited book.
- **DOIs or ISBNs that don't check out**, or that resolve to a real but unrelated source.
- **Citations that don't actually verify the claim** attached to them, once checked.

## What does NOT indicate AI on its own

Don't flag these in isolation. Treating them as evidence is how false accusations happen:

- Perfect grammar (plenty of skilled human writers have this)
- Formal or academic tone generally (only specific overused words are a signal, not formality itself)
- Transition words like "Additionally" or "Notably" used occasionally
- Unsourced content (most under-cited writing predates LLMs entirely)
- Markdown formatting by itself (common among developers and on tools like Obsidian, Slack, GitHub, Google Docs)
- Text that predates roughly November 2022, before ChatGPT existed publicly (AI use can be ruled out categorically here)
- A writer's inability to instantly produce a source for something they wrote. Ask them; if they can explain and correct it, that's an ordinary mistake, not AI use.

## Running a detection pass

1. Read the full text once for a first impression, then go category by category rather than skimming once.
2. For each hit, note the exact phrase and its category. Don't just tally a number.
3. Check whether hits cluster (multiple categories, or several vocabulary hits close together) or sit isolated and scattered.
4. Weigh against the "does NOT indicate AI" list. Subtract anything also explainable by ordinary human writing, non-native English, or the source's own conventions.
5. Give a calibrated, hedged verdict naming the specific patterns found, rather than a flat yes/no. For example, "a couple of isolated items, not meaningful alone" versus "several independent categories clustering together, worth a closer look."
6. If the text is a Wikipedia page, draft, or talk-page comment, also check `references/detailed-signs.md` for the Wikipedia-specific signs (wikitext/Markdown mismatches, hallucinated categories or templates, AfC "submission statements," edit-summary patterns). These are much stronger evidence, since they're hard for a human to produce by accident.

### Worked example

> The founding of the Meadowbrook Historical Society in 1978 marked a pivotal moment in the preservation of the town's cultural heritage. It's not just a local archive. It's a testament to the community's enduring commitment to its roots. The society boasts a growing collection of artifacts and continues to garner attention from regional media outlets. Despite its modest size, the society faces several challenges, including funding and visibility, but ongoing efforts by dedicated volunteers underscore its lasting significance to Meadowbrook.

A pass over this invented paragraph turns up: undue-significance framing three separate times ("marked a pivotal moment," "a testament to," "underscore its lasting significance," all Category 1), a negative parallelism ("it's not just X... it's Y," Category 2), avoidance of a plain copula ("boasts," Category 2), notability-by-attribution ("garner attention from regional media," Category 1), and a formulaic challenges/close ("faces several challenges... but ongoing efforts... underscore," Category 1). Five hits across four sub-patterns in one short paragraph is a real cluster worth flagging clearly, even though no single phrase here is impossible for a human to have written.

## Running a self-edit pass on your own writing

Before finalizing a substantial piece of your own writing, reread it once specifically hunting for the items above, the way you'd proofread for typos:

- Replace "serves as / boasts / stands as" with a plain "is / has" wherever the plainer version reads fine.
- Cut any sentence whose only content is that something is significant, rather than a specific, checkable fact.
- Delete weasel attributions ("observers note," "experts argue") unless you can name the actual source.
- Drop the "-ing" clause on a sentence if it's only asserting importance, not adding information.
- Don't reach for three of anything by default. One or two concrete examples usually communicate better than a padded triad.
- Read dashes out loud. If a comma or period works just as well, use that instead.
- Don't bold the same term every single time it appears.
- Skip the "Despite these challenges, X continues to..." closer unless there's something specific and true to say.
- Let repeated words repeat. Rewriting "the author" as "the wordsmith" as "this literary figure" three sentences running is worse than saying "the author" three times.

None of this is a word-avoidance quota. Each item tends to replace something specific and true with something generic and inflated, so if you catch yourself reaching for one of these constructions, that's usually a sign the sentence doesn't have enough real content yet. Add the specific fact instead of dressing up its absence.

## Source

Adapted from Wikipedia's ["Wikipedia:Signs of AI writing"](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) (WikiProject AI Cleanup), available under CC BY-SA 4.0. This skill reorganizes and condenses that material into an actionable checklist instead of reproducing it directly. See `references/detailed-signs.md` for the deeper cuts: full vocabulary-by-era lists, tool-specific artifact strings, Wikipedia-specific structural signs, and older/historical signs.
