# Repository Formatting Standard

## Defaults

The repository uses `.editorconfig` and `.prettierrc.json` as the shared formatting contract:

- UTF-8 text, LF line endings and a final newline.
- Two spaces for indentation; tabs are not used.
- Consistent multi-line CSS rule blocks and readable JavaScript functions.
- A 100-character preferred line width, with formatter-managed wrapping.
- Existing runtime behavior and authored content must not be changed by formatting.

## Supported files

The formatting workflow applies Prettier to CSS, JavaScript, MJS, HTML, JSON, Markdown and YAML files. Dependency lockfiles, generated output, minified assets and GitHub workflow YAML are excluded from the automated commit. GitHub workflow files are maintained separately because the repository's GitHub Actions token cannot rewrite workflow definitions.

## Running locally

From the repository root:

```bash
npx prettier@3.6.2 --write "**/*.{css,js,mjs,html,json,md,yml,yaml}"
git diff --check
npm run test:smoke
```

Run the focused suites when changing their corresponding modules:

```bash
npm run test:number-maze
npm run test:math-court
npm run test:little-shop-money
npm run test:little-shop-cashier
```

## Scope and review

Formatting-only changes should be reviewed separately from behavior changes. Do not compress multiple declarations or function bodies onto one line for brevity. Keep comments, meaningful blank lines, semantic grouping and existing accessibility annotations.

The maintenance formatter workflow applies the same Prettier version and configuration to the supported repository files. A green formatting run proves that the formatter completed and the diff has no whitespace errors; the Tests workflow is still required to check runtime behavior.
