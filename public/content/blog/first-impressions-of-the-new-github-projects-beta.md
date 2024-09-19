---
title: First impressions of the new GitHub Projects Beta
splash:
  image: images/red-autumn-leaves.jpg
date: 2021-10-31
excerpt: |
  Project tables are spreadsheet-like views where each row is a real or a draft issue. Beta Projects also support kanban views. Task lists and draft issues can be converted into real issues.
---

# First impressions of the new GitHub Projects Beta

GitHub issues have historically provided a simple yet powerful way to track work in your GitHub repositories. Each issue includes a description, assignee(s), and a timeline with a comment thread and automatically-generated references to related issues and PRs. Issues can be categorized using labels, and the issues list can be searched or filtered in many ways.

As projects get larger and more complex, working with issues also has its challenges.

### Issues with GitHub issues
- How to turn large "Epic" issues into smaller issues?
- How to prioritize and organize issues into iterations?
- How to track issues across multiple repositories?
- How best to incorporate community contributions and other feedback?

GitHub has incrementally tried to address some of these challenges. 

- [Task lists](https://docs.github.com/en/issues/tracking-your-work-with-issues/about-task-lists) add convenient checkboxes to markdown lists in issue descriptions.

- [Milestones](https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/about-milestones) provide a simple way to collect and prioritize issues within a repo. 

- [Projects](https://docs.github.com/en/issues/organizing-your-work-with-project-boards/managing-project-boards) started as single-repo kanban boards, with issues or notes moving vertically or sideways. They later acquired cross-repo and limited automation capabilities.

- [Issue templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/about-issue-and-pull-request-templates) help contributors to include specific information in an issue.

## The new GitHub Issues (Beta)

> With their Issues announcement in June, GitHub signalled a less-incremental approach.

The [announcement](https://github.blog/changelog/2021-06-23-whats-new-with-github-issues/) included two parts

1. A powerful new way to [create](https://docs.github.com/en/issues/trying-out-the-new-projects-experience/creating-a-project) and [group issues](https://docs.github.com/en/issues/trying-out-the-new-projects-experience/customizing-your-project-views) into projects.
2. Ways to grow from ideas expressed as text, into collections of issues.

[More announcements](https://github.blog/changelog/label/issues/) have followed, and last week the [Beta opened up](https://github.blog/changelog/2021-10-27-the-new-github-issues-public-beta/) to all users.

## Beta Projects

[Project tables](https://docs.github.com/en/issues/trying-out-the-new-projects-experience/about-projects) are spreadsheet-like views where each row is a real or draft issue. 

[![Screenshot of GitHub project table](images/gh-project-table.png)](https://github.com/orgs/github/projects/4247/views/7)

Rows (issues) can be grouped by field value. This includes custom fields whose values are maintained in the project instead of on issues in a repo. Maintaining custom field data inside projects is key to their power.

> Rather than polluting your issues with all possible categories of tags, new categories can be scoped inside a project.

Since Beta Projects also support kanban views, I expect them to replace the existing Projects once they reach feature parity.

## From text to issues

Auto-creating issues from [task lists](https://docs.github.com/en/issues/tracking-your-work-with-issues/about-task-lists#about-issue-task-lists) makes it easier to break down "epic" issues into smaller sub-issues. The task list item is checked off when the issue is resolved, and the child-issue links to the parent-issue with the task list.  

[![Screenshot of GitHub issue with a task list](images/gh-task-list.png)](https://github.com/gitpod-io/gitpod/issues/3065)

Similarly, [draft issues](https://docs.github.com/en/issues/trying-out-the-new-projects-experience/creating-a-project#adding-items-to-your-project) which are simply rows entered as text in a project table, can also be [converted](https://docs.github.com/en/issues/trying-out-the-new-projects-experience/creating-a-project#converting-draft-issues-to-issues) into issues. 

[![Screenshot of converting draft issue to issue in GitHub project table](images/gh-project-table-convert-to-issue.png)](https://github.com/orgs/github/projects/4247/views/7)

> This makes task lists and project tables two convenient ways to brainstorm ideas, and break them down into smaller issues.

## What's next

The GitHub public roadmap features a [planning view](https://github.com/orgs/github/projects/4247/views/7) specific to issues. 

A number of informative talks at the recent [GitHub Universe 2021](https://www.githubuniverse.com/2021/) also provided hints about what the team is planning.

> Remember that the new projects and issues features are still in Beta.



_To leave a comment  
please visit [dev.to/jldec](https://dev.to/jldec/first-impressions-of-the-new-github-projects-beta-nca)_

