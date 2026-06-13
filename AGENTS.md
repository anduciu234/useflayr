# Flayr Public Website

This repository is the public marketing website, separate from the Flayr app.

## Deployment

- GitHub: `anduciu234/useflayr`
- Vercel project: `useflayr`
- Vercel project ID: `prj_5OSpT7eYlqhYJGBL07L3fYNjzzTk`
- Production domains: `useflayr.com`, `www.useflayr.com`
- App repository: `F:\Flayr\flayr-app` / `anduciu234/flayr-app`

Do not make public website changes in `flayr-app`.

## Vercel Analytics

Vercel Web Analytics is enabled on the `useflayr` project. The static pages
load the first-party beacon from:

`/_vercel/insights/script.js`

The live ingestion endpoint is:

`/_vercel/insights/view`

The beacon intentionally ignores headless browsers. Verify ingestion with a
normal browser without content blockers, or with one controlled POST request to
the live view endpoint.
