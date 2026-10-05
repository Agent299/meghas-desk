# One Workspace per person

Each person (login account) belongs to exactly one Workspace, either as its Owner or as a Team member; there is no workspace switcher. We chose this for v1 because MeghasDesk's top risk is data leaking between Workspaces, and tying a person to a single Workspace lets every request take its Workspace from the logged-in person instead of from a "currently selected Workspace" the client sends, which is one less thing to get wrong.

## Considered Options

- **Many Workspaces per person, with a switcher.** Rejected for v1. It serves freelancers and agencies who support several businesses, but every query would have to be filtered by the active Workspace and checked for membership, and that's where isolation bugs hide.

## Consequences

- Someone who already owns or belongs to a Workspace can't accept an Invite link to another one with the same account. They have to sign in with a different Google or GitHub account, and the invite page says so.
- Allowing more than one Workspace later means migrating membership to a many-to-many relationship, adding the switcher, and re-checking every query that currently gets its Workspace from the person.
