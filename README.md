# Bellweather / The Violet Edge Manuscript Bundle

This bundle is a modular Markdown workspace for developing the Bellweather / The Violet Edge campaign setting book and a future static HTML wiki/reference site.

## Workflow

1. Use the all-in-one source draft in `references/source_drafts/` as the extraction source.
2. Pull content into the modular `.md` files under `manuscript/`.
3. Keep frontmatter intact so the same files can later feed a static HTML wiki, manuscript compiler, or GM reference exporter.
4. Treat `player_safe: false` as GM-only until a player-facing version is intentionally created.

## Recommended Production Pipeline

**Manuscript Markdown → ugly layout prototype → page allocation → final publication layout → appendix quick references.**

## Frontmatter Fields

- `id`: stable machine-friendly identifier
- `title`: display title
- `section`: broad section bucket
- `type`: chapter_section, location, faction, npc, major_trouble, handout, tracker_sheet, etc.
- `player_safe`: whether this can appear in a player-facing wiki without GM review
- `tags`: searchable taxonomy
- `related`: cross-reference IDs, to fill in later
- `status`: stub, draft, revised, final
- `source`: current extraction source

## Suggested HTML Wiki Buckets

- Home
- Bellweather
- The Violet
- Running the Campaign
- Civic Systems
- Faith, Dreams, and Public Meaning
- Factions
- NPCs
- Locations
- Trouble Webs
- Monsters and Manifestations
- Handouts
- Trackers
- GM Only
