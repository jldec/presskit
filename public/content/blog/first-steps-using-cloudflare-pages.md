---
title: First steps using Cloudflare Pages
splash:
  image: images/small-clouds.jpg
date: 2021-01-31
excerpt: This is a walkthrough of my first Cloudflare Pages (Beta) site, and a comparison with GitHub Pages.
---

# First steps using Cloudflare Pages

My personal blog, [jldec.me](https://jldec.me), is hosted on [Netlify](https://netlify.com). Whenever I push markdown to GitHub, Netlify runs a build and publishes the HTML.

Cloudflare recently [announced](https://blog.cloudflare.com/cloudflare-pages/) a similar offering called [Cloudflare Pages](https://pages.cloudflare.com/). I was lucky enough to be given access to the Beta.

Unlike [Netlify](https://www.netlify.com/pricing/#features), Cloudflare Pages [does not meter](https://pages.cloudflare.com/#pricing) request traffic. This opens the door for use-cases like CDN hosting of open source [ESM modules](migrating-from-cjs-to-esm) 🤔.

## Cloudflare Pages (Beta)

This is a walkthrough of setting up [jldec.eu](https://jldec.eu), a copy of [jldec.me](https://jldec.me), on Cloudflare Pages.

If you have access to Cloudflare Pages, you will see this button when you login to Cloudflare.

![Cloudflare Pages Beta button on dashboard](images/cf-pages-beta.png)

The Pages button opens your Pages projects -- of which there are none at first -- and a button to `Create a project`.

![Pages - Create a project](images/cf-pages-create-a-project.png)

 This opens the GitHub form for granting repo access to the 'Cloudflare Pages' GitHub app. (_Look for it later in your [GitHub Settings](https://github.com/settings/installations) to add more repos, or to revoke access._)

![Authorize Cloudflare Pages app on GitHub](images/cf-pages-github-app.png)

Back on Cloudflare, you can choose the repo for your new Cloudflare Pages project.  
[cloudflare-pages-test](https://github.com/jldec/cloudflare-pages-test) is a copy of my markdown source repo from [jldec.me](https://jldec.me).

![Select repo for the Cloudflare Pages project](images/cf-pages-select-repo.png)

In the configuration form, I provided branch name, build command, and output directory.  
The project name defaults to the repo name.

![Configure the build command and output directory](images/cf-pages-configure-build.png)

Submitting the form, triggers the first build and shows the log.

![First build and deploy showing log](images/cf-pages-build-log.png)

The project page also has a section for configuring custom domains. I used my own cloudflare-hosted domain [jldec.eu](https://jldec.eu). The [docs](https://developers.cloudflare.com/pages/getting-started#add-a-custom-cname-record) can be a little confusing here. My CNAME points to `cloudflare-pages-test.pages.dev` not `custom.pages.dev`.

![Cloudflare Pages custom domain](images/cf-pages-custom-domain.png)

You can visit the deployed site at [jldec.eu](https://jldec.eu). 🇪🇺  
Subsequent commits to this GitHub [repo](https://github.com/jldec/cloudflare-pages-test) will trigger a fresh build and re-deploy.

![More deployments](images/cf-pages-deployments.png)

## GitHub Pages

For comparison, I set up [jldec.uk](https://jldec.uk), another copy of [jldec.me](https://jldec.me) using [GitHub Pages](https://pages.github.com).

First I created a new jldec.uk [repo](https://github.com/jldec/jldec.uk/) to host the GitHub Pages site. Since the output includes javascript bundles, fonts, etc., I prefer to keep it separate from the source.

I pushed the first generated website to this repo manually, using the output of a local build. The empty `.nojekyll` file is important to avoid a Jekyll build on GitHub.

![GitHub Pages repo](images/gh-pages-repo.png)

Next I configured GitHub Pages in the repo settings ([...looks familiar 😃](https://github.blog/2016-08-17-simpler-github-pages-publishing/))

![GitHub Pages settings](images/gh-pages-settings.png)

You can visit the deployed site at [jldec.uk](https://jldec.uk). 🇬🇧  

Finally I set up [GitHub Actions](https://github.com/jldec/cloudflare-pages-test/blob/main/.github/workflows/generate.yaml) to auto-build and auto-deploy the website when the source changes. This is triggered on push, does a checkout of both repos, and commits the new generated output, only when there are actual changes.

```yaml
on:
  push:
    branches: [ main ]
  workflow_dispatch:
jobs:
  generate:
    runs-on: ubuntu-latest
    env:
      JLDEC_UK: TRUE

    steps:
    - name: checkout source repo
      uses: actions/checkout@v2

    - name: checkout destination repo under ./out
      uses: actions/checkout@v2
      with:
        repository: jldec/jldec.uk
        token: ${{ secrets.GH_TOKEN }}
        path: out

    - name: generate output
      run: |
        npm ci
        rm -r out/*
        npm run generate
        cd out
        git config user.email "jldec@ciaosoft.com"
        git config user.name "cloudflare-pages-test generate action"
        git status
        git add -A
        if ! git diff-index --quiet HEAD ; then git commit -m 'https://github.com/jldec/cloudflare-pages-test/actions/runs/${{ github.run_id }}' && git push ; fi
        echo done
```
Now every push triggers a new build and re-deploy.

![GitHub Pages builds using GitHub Actions](images/gh-pages-builds.png)

Preserving the HTML site in git is useful for all kinds of reasons. E.g. here is part of a diff from a recent [commit](https://github.com/jldec/jldec.uk/commit/0efb3e73ea2de797f9201b69803c70299be05a28).

![GitHub Pages diff](images/gh-pages-diff.png)

## Conclusions

The developer experience of hosting a site with CloudFlare Pages is very similar to Netlify.

The Cloudflare Pages Beta does not yet support redirects and functions, but those are expected with the integration of [Cloudflare Workers](https://workers.cloudflare.com).

Automating builds and deploys onto GitHub Pages is more work, and requires knowledge of GitHub Actions if you're not using Jekyll. There are other gotchas with GitHub Actions if you want to support concurrent builds or preview builds.

> The performance of all 3 platforms is excellent since they all serve static files from a CDN  
> 🏃‍♀️


_To leave a comment  
please visit [dev.to/jldec](https://dev.to/jldec/first-steps-using-cloudflare-pages-40gp)_


