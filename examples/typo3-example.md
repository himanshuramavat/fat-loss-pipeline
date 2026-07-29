# Example: TYPO3 Site (Composer + DDEV)

This example shows **Daily Ops** outputs for a fictional **Acme Corporate Site** — a TYPO3 v13 Composer project with custom extensions, DDEV local dev, and Solr search.

Tool-agnostic: usable by Cursor, Claude Code, Aider, Cline, or any agent with file and git access.

---

## Fictional Project Snapshot

```text
acme-corporate/
├── README.md
├── composer.json
├── .ddev/
│   └── config.yaml
├── config/
│   ├── sites/main/
│   │   └── config.yaml
│   └── system/settings.php
├── packages/
│   ├── site_news/
│   │   ├── Classes/
│   │   ├── Configuration/
│   │   └── ext_emconf.php
│   └── site_theme/
│       ├── Configuration/TypoScript/
│       └── Resources/Public/
├── public/
│   └── index.php
└── var/
    └── cache/
```

---

## Scenario: Daily Task — Add News Teaser to Homepage

Developer pastes [prompts/START_TASK.md](../prompts/START_TASK.md) with: *"Add a news teaser showing the 3 latest articles on the homepage."*

---

## Sample: TASK_BRIEF.md (excerpt)

### Goal

Show the three most recent published news records on the homepage via a Fluid partial.

### Scope In

- `packages/site_news/` — new Fluid partial and TypoScript setup
- `packages/site_theme/` — include partial in homepage template
- Page TSconfig if a new content element wrapper is needed

### Scope Out

- Solr index configuration (search unaffected)
- Backend news editing UI
- Multi-language news filtering (follow-up task)

### Files to Read First

| File | Why |
| ---- | --- |
| `packages/site_news/Classes/Domain/Repository/NewsRepository.php` | Existing query patterns |
| `packages/site_theme/Configuration/TypoScript/setup.typoscript` | Homepage rendering |
| `config/sites/main/config.yaml` | Site root and language setup |

### Files to Change

| File | Expected change | Evidence |
| ---- | --------------- | -------- |
| `packages/site_news/Configuration/TypoScript/setup.typoscript` | Register news teaser data processor | Similar pattern in `packages/site_news/Configuration/TypoScript/` |
| `packages/site_theme/Resources/Private/Templates/Page/Home.html` | Include `{newsTeaser}` partial | [Fact] Homepage template at this path — Evidence: TypoScript `templateName = Home` in site_theme setup |

### Risks

| Area | Risk | Verification |
| ---- | ---- | ------------ |
| Cache | Stale news on homepage after publish | Flush caches; verify `ddev typo3 cache:flush` |
| Performance | N+1 queries if repository not optimized | Check query count in dev; use existing repository method |

### Verification Plan

```bash
ddev start
ddev composer install
ddev typo3 cache:flush
# Manual: publish a news record, reload homepage, confirm 3 teasers appear
```

### Assumptions

- [Assumption] News records use `datetime` field for ordering.
  Rationale: `NewsRepository.php` orders by `datetime DESC`; confirm field name in TCA.

---

## Scenario: Session Close — After Implementing Teaser

Developer pastes [prompts/CLOSE_SESSION.md](../prompts/CLOSE_SESSION.md) at end of day.

---

## Sample: SESSION_NOTES.md (excerpt)

**Date:** 2026-07-22  
**Branch:** feature/homepage-news-teaser

### What Was Done

- Added `NewsTeaserProcessor` data processor in `site_news`
- Updated homepage Fluid template to render teaser partial
- Manually verified 3 latest articles display correctly

### Memory Updates

Sections updated in `AI_PROJECT_MEMORY.md`:

- **Active Development** — homepage teaser complete; multi-language filtering deferred
- **When Touching X, Also Check Y** — news display changes → flush TYPO3 caches and verify Solr index unchanged

---

## Sample: AI_PROJECT_MEMORY.md patch (excerpt)

```markdown
## Active Development

- Multi-language news teaser filtering (deferred from homepage task)

## When Touching X, Also Check Y

| If you change... | Also verify... |
| ---------------- | -------------- |
| News Fluid templates | Cache flush (`ddev typo3 cache:flush`); frontend homepage |
| `packages/site_news/` TCA | Backend news form still saves; existing list view unaffected |
| Solr indexer classes | Run `ddev solrctl apply` if index schema changes |

## Verification Checklist

```bash
ddev start
ddev composer install
ddev typo3 cache:flush
ddev typo3 extension:list   # confirm site_news, site_theme active
```
```

---

## Sample: PREPARE_PR output (excerpt)

**Title:** Add homepage news teaser showing latest 3 articles

### Summary

- Adds `NewsTeaserProcessor` to fetch latest published news
- Renders teaser partial on homepage via site_theme template
- No Solr or backend changes

### Test Plan

- [ ] `ddev typo3 cache:flush` — no errors
- [ ] Manual: homepage shows 3 news teasers after publishing test record
- [ ] Manual: news list page unchanged

### Risk Notes

| Area | Risk | Mitigation |
| ---- | ---- | ---------- |
| Cache | Stale homepage after news publish | Documented cache flush in TASK_BRIEF; verified manually |

---

## Key Facts (from onboarding context)

- [Fact] TYPO3 v13 Composer setup with custom extensions in `packages/`. — Evidence: `composer.json`, `packages/*/ext_emconf.php`
- [Fact] Local dev via DDEV. — Evidence: `.ddev/config.yaml`, README setup commands
- [Fact] Site configuration in `config/sites/main/`. — Evidence: `config/sites/main/config.yaml`

## Assumptions

- [Assumption] Solr is configured but not affected by this UI-only change.
  Rationale: no indexer classes modified; confirm if news indexing hooks into display layer.

---

## Related

- Stack add-ons for TYPO3 in [PROJECT_ONBOARDING_PROMPT.md](../PROJECT_ONBOARDING_PROMPT.md)
- Daily prompt cheatsheet: [DAILY_OPS.md](../DAILY_OPS.md)
