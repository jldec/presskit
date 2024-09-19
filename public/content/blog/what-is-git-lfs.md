---
title: What is git LFS?
splash:
  image: images/station-clouds.jpg
date: 2022-02-08
excerpt: Git large file storage or LFS is a way to store binaries outside your git repo, but still work with them as if they were part of the repo.
---

# What is git LFS?

Git large file storage or LFS is a way to store binaries outside your git repo, but still work with them as if they were part of the repo.

It works by replacing the actual file with a small text file which contains a pointer to the real thing. Every problem in computer science can be solved by another level of indirection.

```sh
$ cat screenshot.png 
version https://git-lfs.github.com/spec/v1
oid sha256:8ded39c045d36d4f745e46525b5c8b6a29baceb89006a3e85148ce66db9c187d
size 280654
```

For a brief introduction to LFS see https://git-lfs.github.com/ or watch this [video](https://www.youtube.com/watch?v=uLR1RNqJ1Mw).

## Installation
Installation requires 2 steps.

1. Place `git-lfs` on the path.  
   I pulled the latest binary for macOS arm64 from [GitHub releases](https://github.com/git-lfs/git-lfs/releases).

2. Configure git to use LFS with `git lfs install`.

Both of these steps are included in the `install.sh` script, in the GitHub release.

## Why is the binary called 'git-lfs'?
A git extension is a binary prefixed `git-`.

Running `git lfs` invokes `git-lfs`, which gives you a nice summary of the available commands.

```
To get started with Git LFS, the following commands can be used.

 1. Setup Git LFS on your system. You only have to do this once per
    repository per machine:

        git lfs install

 2. Choose the type of files you want to track, for examples all ISO
    images, with git lfs track:

        git lfs track "*.iso"

 3. The above stores this information in gitattributes(5) files, so
    that file need to be added to the repository:

        git add .gitattributes

 4. Commit, push and work with the files normally:

        git add file.iso
        git commit -m "Add disk image"
        git push
```

## What does 'git lfs install' do?
The command `git lfs install` configures a git filter, which calls git-lfs to convert between pointer files and the actual blobs.
This filter configuration lives in your git config (e.g. at `~/.gitconfig`) and applies to all your repos.

```.gitconfig
[filter "lfs"]
	clean = git-lfs clean -- %f
	smudge = git-lfs smudge -- %f
	process = git-lfs filter-process
	required = true
```

If you prefer not to run these hooks all the time, you can uninstall them with `git lfs uninstall` after finishing your work on an LFS git repo.

## How is a repo configured to use LFS?
The command `git lfs track '*.png'` adds the following line to the `.gitattributes` file in the repo.

```.gitattributes
*.png filter=lfs diff=lfs merge=lfs -text
```

This associates git-lfs with `.png` files.
Once the association is made, you can work with those files normally, and git-lfs will handle the LFS interactions with GitHub automatically, in the background.

## Example repo
This repo lives at [github.com/jldec/lfs-test](https://github.com/jldec/lfs-test)

```sh
$ git init
Initialized empty Git repository in /Users/jldec/lfs-test/.git/

$ git lfs track '*.png'
Tracking "*.png"

$ git lfs track
Listing tracked patterns
    *.png (.gitattributes)
Listing excluded patterns

$ git add -A
$ git commit -m 'initial commit'
[main (root-commit) c25b950] initial commit
 2 files changed, 4 insertions(+)
 create mode 100644 .gitattributes
 create mode 100644 screenshot.png

$ git lfs ls-files
ba2a8c5285 * screenshot.png

$ git remote add origin git@github.com:jldec/lfs-test.git
$ git push -u origin main
Uploading LFS objects: 100% (1/1), 146 KB | 0 B/s, done.
Enumerating objects: 4, done.
Counting objects: 100% (4/4), done.
Delta compression using up to 8 threads
Compressing objects: 100% (3/3), done.
Writing objects: 100% (4/4), 408 bytes | 408.00 KiB/s, done.
Total 4 (delta 0), reused 0 (delta 0), pack-reused 0
To github.com:jldec/lfs-test.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.

$ git status
On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   screenshot.png

no changes added to commit (use "git add" and/or "git commit -a")

$ git commit -a -m 'update lfs file screenshot.png'
[main e695f5f] update lfs file screenshot.png
 1 file changed, 2 insertions(+), 2 deletions(-)

$ git push
Uploading LFS objects: 100% (1/1), 281 KB | 121 KB/s, done.
Enumerating objects: 5, done.
Counting objects: 100% (5/5), done.
Delta compression using up to 8 threads
Compressing objects: 100% (3/3), done.
Writing objects: 100% (3/3), 405 bytes | 405.00 KiB/s, done.
Total 3 (delta 0), reused 0 (delta 0), pack-reused 0
To github.com:jldec/lfs-test.git
   c25b950..e695f5f  main -> main
```

_To leave a comment  
please visit [dev.to/jldec](https://dev.to/jldec/what-is-git-lfs-28db)_


