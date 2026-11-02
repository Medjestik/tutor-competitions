# Spec Delta

## Purpose

Lets staff safely mark competition finalists on production databases by matching protocol practice titles to participant forms.

## ADDED Requirements

### Requirement: Dry-run by default

The mark-finalists command MUST match input practice names to participant forms and report outcomes without writing `passed_final` unless an explicit apply flag is passed.

#### Scenario: Default dry-run

- **WHEN** the command runs without apply
- **THEN** no user record MUST change and a human-readable report MUST list matched, unmatched, and ambiguous rows

### Requirement: Apply sets passed final on form author only

When apply is requested, the command MUST set `passed_final` to true only for the author user of each uniquely matched form. It MUST NOT change `current_stage` or coauthors.

#### Scenario: Successful apply

- **WHEN** apply is used and a practice name matches exactly one form
- **THEN** that form's author MUST have `passed_final` true after the command completes

#### Scenario: Already marked

- **WHEN** apply matches a user who already has `passed_final` true
- **THEN** the command MUST report already passed without error and MUST NOT require duplicate writes

### Requirement: CSV input format

The command MUST accept a UTF-8 CSV with a required practice name column (aliases consistent with semifinalist marking: `practice_name`, common typos, Russian headers). Optional organization column MAY appear for reporting only.

#### Scenario: Valid CSV

- **WHEN** input contains required practice names
- **THEN** the command MUST attempt matching for each row and include the row in the report

#### Scenario: Unmatched practice

- **WHEN** no form matches a practice name uniquely
- **THEN** the command MUST list the row as unmatched or ambiguous and MUST NOT set any user flag for that row on apply
