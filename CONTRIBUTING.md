# Contributions Guide
This guide is intended to serve as a reference/style guide for contributions to the Orderly project. **Please read through this and make sure all commits, PRs, branches, etc. follow these standards.**

## Commits
In general, commits should be in small, readable chunks. Edits to the code included in each commit should be logically related (i.e. when changing how a form reacts to user input, group logic changes, style changes, and display changes in their own commits). Try to avoid individual commits that are massive (i.e. 500 lines changed in 1 commit). Sometimes it might be avoidable, but as a general rule, **keep them small**.

### Commit Messages
Commit messages should be in present tense imperative (i.e. `Add new button` instead of `Added new button`). Commit messages should be descriptive of the commit that was made. Avoid messages like `Update login component`. Of course, don't be _TOO_ descriptive. It doesn't have to be a novel like Sophia would write:grin:, but it should describe the changes each commit makes. Include what files/components were changed and what was added/removed/altered.

## Pull Requests (PRs)
### When to Submit
PRs should be submitted for all changes to the codebase. This ensures that multiple eyes take a look at the changes before they are merged. PRs **must** be reviewed *and* approved by another contributor before they can be merged.
### Title
Pull request titles should follow this general format:

`type(scope): description`

- `type` means the type of change. Currently, types of PRs are as follows (these can be changed or added to):

    | Type | Description
    |------|--------|
    | `feat` | Adds a new feature |
    | `fix` | Fixes bugs or other errors |
    | `docs` | Adds to or updates project documentation |
    | `refactor` | Rewrite and improve existing code while not adding to or changing functionality
    | `test` | Add or updates tests for prexisting components |
    | `build` | Adds files and config for building the app | 
    | `chore` | Repetitive tasks for project upkeep, like upgrading dependencies |

- `scope` means the part of the code the PR wants to change. Examples of scope would be `frontend`, `login-page`, `order-handling`, etc.

- `description` is a brief description of the PR's purpose. Think of it like a commit message for the PR. It should summarize the changes made. Leave long descriptions for the Description section.

### Description
> We also have the option of creating PR templates to make formatting automatic
PR descriptions should contain a detailed description of what your PR does. Include things like:
1. Exactly what components it changes
2. Explain what your new code does (possibly include code samples or reference specific commits)
2. How these changes will affect the functionality of those components and the app in general
3. The reason for making these changes (i.e. problem encountered or feature idea)
4. If the PR is in response to an Issue, write `fixes #[issue number]` or `closes #[issue number]`. For example, if a PR fixes issue #41, write `fixes #41`. This should be the _last_ item in your PR description and should be on a separate line.


## Branches
Everytime you are working on a code edit, please do it in a new branch. This will make tracking and reviewing code much easier. Create new branches when working on: 
- New features
- Bug fixes
- Emergency patches
- Docs changes
- Dependency upgrades
- Pretty much everything else

### Titles
Branch titles should be very similar to [PR titles](#title). They should tell a viewer the basics of what they need to know about the branch.
Titles should be formatted as follows:

`scope/description`

- `scope` means the part of the code relevant to the branch (i.e a branch editing the docs would be `docs/description`, while a branch making backend changes would be `backend/description`).
- `description` is a brief description of the purpose for the branch (i.e. a branch adding a new login button would be `frontend/new-login-button`).