# This or That 🤔

> The fun and easy way to make decisions, and help others do the same.

This or That is a simple web app that allows you to ask the community to decide between two options for you.

## Why ❓

I built this site for fun, experience, and mostly because I wanted to try out realtime updates with Cloud Firestore (see [tech stack](#tech-stack)).

## Usage 🧪

If you want to add your own item:

1. Click the 'I need help deciding' button.
2. Supply a post title (e.g. "Should I learn guitar or piano?").
3. Give a succinct and clear summary of one of the two options.
4. Do the same for your other option.
5. Click 'submit'.
6. The page should automatically update to show your item, along with a [vote bar](#vote-bar)

To vote on an item:

1. Click the 'this/that is what I would choose' button on the card corresponding to your choice.
2. The [vote bar](#vote-bar) should update to reflect your vote.

## Vote bar 🗳️

Votes are displayed as a percentage, rather than exact tallies. The vote bar represents 100%, with the blue fill representing the percentage of votes for 'this', and red the percentage for 'that'.

### Tech stack 🥞

This project was build using React (with [material-ui](#https://material-ui.com/) components), TypeScript, and Firebase.

The page is fully responsive, and updates to reflect changes in realtime - votes and new items should display without the need to refresh.
