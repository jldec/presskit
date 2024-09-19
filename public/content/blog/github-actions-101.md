---
title: GitHub Actions 101
splash:
  image: images/snowy-boathouse.jpg
date: 2020-11-27
excerpt: Not so mysterious after all 😀
---

# GitHub Actions 101

Today I was feeling a bit lost (again, sigh) trying to understand GitHub Actions.

Specifically, the [documentation](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions) did not appear to have an overview of how actions are composed and what they are composed of. What are those things that run? How are they named and referenced?

In retrospect, instead of the docs, I would recommend getting started by looking at the yaml for the [Simple workflow](https://github.com/actions/starter-workflows/blob/main/ci/blank.yml). The button appears in the __Actions__ tab on any new repo.

![Screenshot of GitHub Actions tab on new repo, showing sample workflow](images/actions-start-here.png)

The button will open the workflow yaml in an editor (it won't be committed to your repo yet).

![Screenshot of Simple workflow yaml code](images/simple-workflow.png)

## Not so mysterious after all 😀

> The first takeaway is that actions can be written using simple shell commands.

Commands run in a shell in VMs which come preinstalled with [commonly used tools](https://github.com/actions/runner-images/blob/main/images/linux/Ubuntu2204-Readme.md). There is no need to learn a new scripting language. You can even write your action as a shell script in a file, and invoke it from the workflow yaml.

If you want, you can package and re-use portions of a job in different workflows. These components are also called [actions](https://docs.github.com/en/actions/creating-actions) (that's where some of my initial confusion originated), _but you don't need to learn to write those yourself in order to build your own workflows_.

## Don't be thrown off by the yaml

Each job is identified by its key e.g. `simple-job` in the example below.  
The [workflow syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions) documentation denotes this as `jobs.<job-id>`.
```yaml
on: push
jobs:
  simple-job:
    runs-on: ubuntu-latest
    env:
      HELLO: world
    steps:
    - run: 'echo Hello: $HELLO'
    - run: |
        echo node version: `node -v`
        pwd
```

`steps:` contains a list of commands, each described by a `run:`  
(In the earlier example above, there is also an [action](https://docs.github.com/en/actions/creating-actions/about-custom-actions), described with `uses:` instead of `run:`)

The 1st run: command above is quoted, to avoid ": " being interpreted as a yaml map.

The 2nd run: contains 2 commands in a multi-line (indented) block using "|". This syntax does not require quotes, making it convenient for embedded scripts.

If you push the workflow above to a new repo on GitHub, the result should look like this:

![Screenshot of workflow run showing simple-job output](images/action1.png)

### A few more things to know about [yaml](https://en.wikipedia.org/wiki/YAML)

- You can test the validity of your yaml [online](https://onlineyamltools.com/convert-yaml-to-json).  
  Seeing the JSON representation will often clear up confusion.
- Quotes around (scalar) strings are optional, BUT there are a lot of gotchas!  
  E.g. look out for strings with '- ' at the start, or ': ' or '#' in the middle, or ':' at the end, or strings that look like numbers or booleans.
- Maps are usually written as `key: value` lines at the same indentation.  
  Lists are usually written as lines with `- value`.  
  _Or_ use `{key1: v1, key2: v2, ...}` for maps, `[v1, v2, ...]` for lists.
- Indentation must use spaces (no tabs).
- For more about multi-line strings see https://yaml-multiline.info/.


> Have fun playing with GitHub Actions  
> ⛭

_To leave a comment  
please visit [dev.to/jldec](https://dev.to/jldec/github-actions-101-pfn)_

