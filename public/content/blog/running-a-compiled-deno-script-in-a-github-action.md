---
title: Running a compiled Deno script in a GitHub Action
splash:
  image: images/first-blossoms-2021.jpg
date: 2021-03-14
excerpt: |
  In this post I enhance a GitHub Action to invoke the compiled scan.js Deno script which scans for broken links in generated HTML pages.
---

# Running a compiled Deno script in a GitHub Action

This is a quick followup to my recent post about [Getting Started with Deno](getting-started-with-deno).

In this post I will enhance a GitHub Action to do the following:

- Generate HTML using a static site generator (SSG).
- Launch a preview web server which runs in the background.
- Download a compiled Deno script.
- Invoke the Deno script to scan for broken links in the generated HTML.
- Only publish the HTML if there are no broken links.

## scan.js

I cross-compiled [scan.js](https://github.com/jldec/deno-hello/blob/main/scan.js) using Deno v1.8.1, and uploaded the resulting binaries to a [release](https://github.com/jldec/deno-hello/releases) on GitHub.

Using the releases feature of GitHub is a convenient way to publish compiled artifacts. In this case I used the manual upload feature in GitHub, but this step could be automated as well.

![Releases with compiled artifacts in Repo deno-hello](images/deno-scan-releases.png)

Here is the deno compile [command](https://github.com/jldec/deno-hello/blob/main/compile.sh#L1). The binary for Linux is called `scan-linux-x86`.

```
deno --unstable compile \
  --allow-net \
  --lite \
  --target x86_64-unknown-linux-gnu \
  --output scan-linux-x86 \
  scan.js
```

The resulting binaries are quite large (~50MB), even using [--lite](https://deno.land/manual@v1.7.4/tools/compiler#generating-smaller-binaries), but I expect that to improve.

## .github/workflow/generate.yaml

In this case, I modified the [workflow](https://github.com/jldec/cloudflare-pages-test/blob/main/.github/workflows/generate.yaml) for the static site in [jldec/cloudflare-pages-test](https://github.com/jldec/cloudflare-pages-test). Here is the excerpt of the yaml for the relevant step.

```yaml
- name: generate output
  run: |
    ...
    npm run generate
    npm run preview &
    curl -LO https://github.com/jldec/deno-hello/releases/download/v1.0.0/scan-linux-x86 && chmod +x scan-linux-x86
    ./scan-linux-x86 http://localhost:3001/
    ...
```

`npm run generate` invokes the static site generator.  

`npm run preview &` starts the preview server on port 3001, running in the background.

Both commands are defined as scripts in [package.json](https://github.com/jldec/cloudflare-pages-test/blob/main/package.json).

`curl -LO` downloads the Linux binary from the GitHub release. Running curl here gives the preview server time to start listening on port 3001, before commencing the scan.

## Success

When the `scan-linux-x86` command finds no broken links in the static site, it exits with 0, allowing the GitHub Action [workflow](https://github.com/jldec/cloudflare-pages-test/runs/2112253519?check_suite_focus=true#step:4:72) to continue.

![scan success in GitHub Action log output](images/scan-success.png)

If there are broken links the workflow will [fail](https://github.com/jldec/cloudflare-pages-test/runs/2106962300?check_suite_focus=true), and I will hear about it in my inbox :)

![scan failure in GitHub Action log output](images/scan-failure.png)

> [![Deno logo](images/deno-logo.png ".no-border")](https://deno.land/)

_To leave a comment  
please visit [dev.to/jldec](https://dev.to/jldec/running-a-compiled-deno-script-in-a-github-action-4ljn)_


