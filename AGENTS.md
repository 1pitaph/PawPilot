# Repository Guidelines

## Project Structure & Module Organization

This repository is currently a documentation-first project for the Pet Mobility Agent PRD.

- `docs/prd-pet-mobility-agent.md` is the canonical source document. Edit this file for PRD content changes.
- `docs/prd-pet-mobility-agent.qmd` is the Quarto presentation wrapper. It includes the Markdown file and should not duplicate PRD body text.
- `docs/prd-pet-mobility-agent.html` is rendered output. Do not edit it by hand; regenerate it from the `.qmd` file.
- `.agents/skills/to-prd/SKILL.md` contains the local PRD skill instructions.
- `skills-lock.json` records skill state.

## Build, Test, and Development Commands

Use Quarto for previewing and rendering the PRD:

```bash
quarto preview docs/prd-pet-mobility-agent.qmd
```

Starts a local preview server for the synced Quarto document.

```bash
quarto render docs/prd-pet-mobility-agent.qmd
```

Generates the HTML output from the `.qmd` wrapper and included Markdown.

There is no application build or automated test command yet.

## Coding Style & Naming Conventions

Write contributor-facing documentation in concise Markdown. Use Chinese for PRD body content unless a term is a product name, API term, data field, or established acronym such as `MVP`, `API`, `Agent`, or `PRD`.

Use descriptive kebab-case filenames, for example:

```text
docs/prd-pet-mobility-agent.md
docs/prd-pet-mobility-agent.qmd
```

Keep `.qmd` files as lightweight rendering wrappers. Keep canonical content in `.md` files. When changing document names, titles, paths, references, or render metadata, update the matching `.md` and `.qmd` files together so preview output stays synchronized.

## Testing Guidelines

For documentation changes, verify rendering rather than running code tests:

```bash
quarto render docs/prd-pet-mobility-agent.qmd
```

Check that the table of contents, headings, code blocks, tables, and links render correctly. If editing the `.qmd`, confirm it still includes `prd-pet-mobility-agent.md` instead of copying content.

## Commit & Pull Request Guidelines

This workspace has no Git history, so no existing commit convention is available. Use short imperative commit messages, such as:

```text
Update PRD scope and acceptance criteria
Add Quarto wrapper for PRD preview
```

Pull requests should include a brief summary, the affected document paths, and any rendered preview notes. For visual/document rendering changes, include screenshots or mention the Quarto command used to verify the output.

## Agent-Specific Instructions

Preserve the single-source-of-truth workflow: edit the Markdown source, not the generated HTML. Always check that the related `.qmd` still includes and presents the intended `.md` after Markdown changes. Avoid adding app scaffolding unless the user explicitly asks to implement the product.
