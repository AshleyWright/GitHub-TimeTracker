# GitHub Time Tracker

Inspired by the ruby project [GitHub-Time-Tracking](https://github.com/StephenOTT/GitHub-Time-Tracking),
this provides a dashboard to review time tracked and time estimated on a per
issue, per milestone or per assignee basis.

## Usage

To log time on an issue add a comment to the issue containing a substring of the
form: :clock1: 1d 3h 50m 30s. Where 0 valued components can be omitted, any
clock emoji is valid.

To estimate an issue add a comment to the issue containing a substring of the
form: :dart: 1d 3h 50m 30s. Where 0 valued components can be omitted.

To increase the estimate on an issue add a comment to the issue containing a
substring of the form: :dart: + 1d 3h 50m 30s. Where 0 valued components can be
omitted. This sets the new estimate as the larger of the current tracked or
estimated time, plus the commented time increment.

## Demo

A demo can be seen at [http://ashleywright.com/GitHub-TimeTracker](http://ashleywright.com/GitHub-TimeTracker)
