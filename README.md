# Bellweather / The Violet Edge

**Bellweather / The Violet Edge** is a modular manuscript workspace for developing a 1930s civic-horror tabletop campaign setting and future static reference wiki.

The setting centers on Bellweather, a town caught inside the care of something vast, sincere, and dangerously literal. The Violet is not simply a monster or villain. It is trying to help, but it does not naturally understand consent, proportion, metaphor, grief, faith, civic duty, fear, or what it means for a town to remain itself.

This repository is primarily a working manuscript and development archive. It contains draft material, modular Markdown chapters, setting procedures, factions, NPCs, locations, trouble webs, handouts, and future publication scaffolding.

## Current Status

This is an active work-in-progress manuscript.

Some sections are drafted and structurally stable. Other sections are still stubs, outlines, or placeholders. File names, internal IDs, section order, and wiki structure may continue to change as the project develops.

The current working goals are:

- develop the full Bellweather / The Violet Edge setting book,
- maintain modular Markdown files for easier editing,
- support future static HTML wiki generation,
- separate GM-only material from player-safe material,
- preserve table-facing tools such as trackers, handouts, quick references, and trouble webs.

## What This Repository Contains

The manuscript is organized into modular sections:

```text
01_introduction/
02_bellweather/
03_the_violet/
04_running_the_campaign/
05_civic_survival/
06_faith_dreams_public_meaning/
07_factions_npcs/
08_locations/
09_monsters_manifestations/
10_trouble_webs/
11_starting_the_campaign/
12_endgame/
13_appendix/
```

A typical file is a Markdown document with YAML frontmatter. The frontmatter is used to support indexing, cross-linking, player-safe filtering, future wiki export, and manuscript compilation.

## Project Structure

The broad manuscript structure is:

- **Introduction** — premise, safety notes, campaign thesis, and how to use the book.
- **Bellweather** — the town, daily life, crisis state, and resources.
- **The Violet** — metaphysics, caretaker logic, identity anchors, dreams, travel, and return.
- **Running the Campaign** — Call of Cthulhu integration, City Mode, Expedition Mode, session loop, and alternate systems.
- **Civic Survival** — civic actions, trackers, retainers, resources, and records.
- **Faith, Dreams, and Public Meaning** — public interpretation, service bans, dream pressure, children, and lucid dreaming.
- **Factions and NPCs** — civic factions, major NPCs, and ambient cast support.
- **Locations** — town core, boundary sites, resource sites, and other key places.
- **Monsters and Manifestations** — how the Violet produces threats, roles, and misread forms.
- **Trouble Webs** — playable scenario structures and campaign complications.
- **Starting the Campaign** — opening situation, first session, and character ties.
- **Endgame** — teaching home, final anchors, and possible endings.
- **Appendix** — handouts, tracker sheets, quick references, and table tools.

## Player-Safe and GM-Only Material

Many files include a `player_safe` frontmatter field.

- `player_safe: true` means the file may be suitable for player-facing reference.
- `player_safe: false` means the file should be treated as GM-only unless reviewed and adapted.
- `player_safe: partial` means the file contains some player-safe material but needs review before publication.

The repository may also support a separate player-facing site branch that contains only exported player-safe material. The source manuscript branch should be assumed to contain spoilers.

## Workflow

The current development workflow is:

1. Draft or revise modular Markdown files.
2. Keep frontmatter intact and consistent.
3. Track files in `MANIFEST.md`.
4. Use section indexes for navigation and future wiki support.
5. Treat player-safe export as a separate build or branch.
6. Preserve GM-only spoilers in source files, not in the public player-facing site.
7. Later, compile the manuscript into layout prototypes, publication pages, and printable handouts.

Recommended production pipeline:

```text
Manuscript Markdown
→ static HTML/wiki prototype
→ rough layout prototype
→ page allocation
→ final publication layout
→ appendix quick references and handouts
```

## Frontmatter Fields

Common frontmatter fields include:

- `id` — stable machine-friendly identifier.
- `title` — display title.
- `section` — broad manuscript section.
- `type` — content type, such as `chapter_section`, `location`, `faction`, `npc`, `major_trouble`, `handout`, or `tracker_sheet`.
- `player_safe` — whether the file can appear in a player-facing version without GM review.
- `spoiler_level` — rough spoiler intensity.
- `tags` — searchable taxonomy.
- `related` — cross-reference IDs.
- `status` — stub, draft, revised, or final.
- `source` — current extraction or drafting source.
- `summary` — short description for indexes and wiki navigation.
- `table_use` — how likely the file is to be used directly during play.
- `layout_target` — rough future layout target.

## Wiki / Reference Site Goals

The future static wiki/reference site should support:

- player-safe filtering,
- GM-only sections,
- cross-linked files,
- searchable tags,
- section indexes,
- quick references,
- handouts,
- trackers,
- location pages,
- faction and NPC pages,
- trouble web navigation.

Suggested high-level wiki buckets:

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

## Tone and Content Notes

Bellweather / The Violet Edge is civic horror, not splatter horror.

The setting may involve:

- missing persons,
- grief and ambiguous loss,
- identity uncertainty,
- replacement people,
- dreams and sleep pressure,
- children in danger,
- public panic,
- scarcity and rationing,
- medical triage,
- religious fear and public interpretation,
- civic unrest,
- emergency authority,
- coercive social pressure,
- body horror and transformation.

The intended tone is serious, humane, strange, and table-conscious. Horror should come from care misunderstood, public meaning under pressure, and the danger of a town teaching reality the wrong lesson.

## Design Principle

Bellweather is not saved by becoming perfect.

It is saved, if it is saved, by remaining itself clearly enough that the Violet can finally understand what help actually means.

Core setting rule:

```text
The Violet is not evil.
It is trying to help.
That is what makes it dangerous.
```

## Repository Notes

This repository is a working creative development space. Draft files may be incomplete, inconsistent, or awaiting second-pass revision. The manuscript is being built modularly so that individual sections can mature at different speeds without blocking the entire project.

For the most current file list, see:

```text
MANIFEST.md
```

For publication planning and scope notes, see:

```text
PUBLICATION_NOTES.md
```
