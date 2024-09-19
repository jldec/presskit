---
title: Fun with Vercel
splash:
  image: images/library.jpg
date: 2021-02-07
excerpt: |
  How I deployed [jldec.fun](https://jldec.fun/) using the [Vercel platform](https://vercel.com/docs).
---

# Fun with Vercel

Last week I wrote about [](first-steps-using-cloudflare-pages).

[Vercel](https://vercel.com/home) is another leader in the trend toward static hosting, serverless, and [edge compute](why-serverless-at-the-edge).

## [jldec.fun](https://jldec.fun/fun-with-vercel) 🤪

This is a walkthrough of how I deployed [jldec.fun](https://jldec.fun/) using the [Vercel platform](https://vercel.com/docs).

Markdown source files live in the same repo on [GitHub](https://github.com/jldec/cloudflare-pages-test) as before.

The Vercel signup starts a New Project workflow _(this could be simplified.)_

![Vercel new project workflow with link to GitHub](images/vercel-new-project.png)

I clicked on 'Continue with GitHub', and then chose the first option in the dropdown below.

![Vercel add GitHub account dropdown](images/vercel-add-github-account.png)

This led to the GitHub form for granting repo access to the 'Vercel' GitHub app. (_Look for it later in your [GitHub Settings](https://github.com/settings/installations) to add more repos, or to revoke access._)

![Authorize Vercel app on GitHub](images/vercel-github-app.png)

Back on Vercel, I selected my repo and used my 'Personal Account' scope. Team scope requires a paid plan.

![Select scope for the new project](images/vercel-select-project-scope.png)

I continued with the default (root) project directory within the repo.

![Select project direcotry inside repo](images/vercel-select-directory.png)

In the last form of the Import Project flow, Project Name defaults to the name of the repo, so I changed that to 'jldec-fun'. I also configured a build command and an output directory.

I didn't really need encrypted [environment variables](https://vercel.com/docs/environment-variables) here, but this step doesn't offer an alternative, so I made a note to change it later.

![Configure the build command and output directory](images/vercel-configure-build-jldec-fun.png)

Submitting the form triggered the first build, followed by a nice confetti shower. 🎉

![First build and deploy confetti celebration](images/vercel-confetti-jldec-fun.png)

Unfortunately, visiting the site revealed a problem. Vercel does not automatically serve files stored with an '.html' extension, when a request comes in _without_ any extension.

![Page not found when trying to browse toURL without extension](images/vercel-without-clean-url-setting.png)

The fix requires [cleanUrls](https://vercel.com/docs/configuration#project/clean-urls) to be set in the `vercel.json` file at the project root.

```json
{
  "cleanUrls": true
}
```

Adding this setting fixed my 404 problem.

The same config file would also be useful for other common static hosting requirements like [redirects](https://vercel.com/docs/configuration#project/redirects), HTTP [headers](https://vercel.com/docs/configuration#project/headers), and the treatment of URLs with a [trailing slash](https://vercel.com/docs/configuration#project/trailing-slash).

Back in the well-designed Vercel Settings UI, I was able to change my environment variables to plaintext. I liked the ability to set different values for preview builds.

![Dashboard environment settings](images/vercel-environment-settings.png)

When I added my domain name, the form helpfully recommended configuring an IP address.

![Dashboard domain settings](images/vercel-domain-setting.png)

Once the DNS record was in place, the domain configuration changed to 'Valid'.

![Dashboard domain settings fixed](images/vercel-domain-setting-fixed.png)

> Tada!

[jldec.fun](https://jldec.fun/fun-with-vercel) is deployed from the `main` branch on [GitHub](https://github.com/jldec/cloudflare-pages-test). Commits to any other branch will trigger a preview deployment on a different URL.

![screenshot of jldec.fun](images/vercel-post.png)

> Static websites are awesome!  
> 👍

_To leave a comment  
please visit [dev.to/jldec](https://dev.to/jldec/fun-with-vercel-3b6e)_

