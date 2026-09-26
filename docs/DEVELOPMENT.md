# Maths for All Development Guide

## Runtime

Maths for All targets Node.js 22 and uses plain HTML, CSS, and JavaScript for the browser surface.

Check the version before local work:

    node --version
    cat .nvmrc

## Environment setup

Copy the local template and source it for the current shell:

    cp .env.local.example .env.local
    set -a
    source .env.local
    set +a

Do not commit .env.local. It is intentionally ignored by Git.

For test work, use .env.test.example and a separate SQLite path so test data does not mix with local development data.

## Start the application

    npm start

The default local server listens on 127.0.0.1:8080.

## Validation

Run the existing API regression check:

    npm run test:auth

Run JavaScript syntax checks:

    for file in js/*.js; do node --check "$file"; done

The GitHub Actions workflow remains the authoritative repository CI entry point.

## Visual work

Put reusable local artwork in assets/svg/. Keep presentation CSS in css/visuals.css when it is specific to the decoration layer. Keep game logic in the existing game JavaScript modules.

For decorative HTML images, use an empty alt value so assistive technologies do not announce artwork that does not add information. Keep non-essential motion behind prefers-reduced-motion.

## Scope discipline

Work one planned PR at a time. Do not fold authentication, research infrastructure, analytics, or unrelated gameplay changes into a visual or environment PR.
