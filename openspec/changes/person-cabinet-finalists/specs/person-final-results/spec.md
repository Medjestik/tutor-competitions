# Spec Delta

## Purpose

Показывает участникам официальные итоги полуфинала и персональное поздравление финалистам в личном кабинете после управляемой публикации.

## ADDED Requirements

### Requirement: Final results publication setting

The system MUST treat semifinal/final cabinet results as unpublished unless the setting key `final_results_published` has value `true` (case-insensitive). If the key is missing or any other value, results MUST be unpublished.

#### Scenario: Default unpublished

- **WHEN** the setting key is absent or not `true`
- **THEN** participant cabinet MUST NOT show semifinal verdicts or finalist congratulations content

#### Scenario: Published

- **WHEN** the setting value is `true`
- **THEN** the system MUST allow showing published semifinal/final cabinet content according to user flags

### Requirement: Finalists MAX chat link setting

The system MUST expose the setting key `finalists_max_chat_link` as a string URL for the finalists chat in MAX. An empty or whitespace-only value MUST mean no clickable link is shown.

#### Scenario: Link configured

- **WHEN** `finalists_max_chat_link` contains a non-empty URL and a finalist views the final screen
- **THEN** the participant MUST see a clickable link to that URL in the congratulations text

#### Scenario: Link not configured

- **WHEN** `finalists_max_chat_link` is empty and a finalist views the final screen
- **THEN** the participant MUST still see the invitation to join the MAX chat without a broken or placeholder hyperlink

### Requirement: Passed final user flag

The system MUST store on each participant user a boolean `passed_final` indicating the author passed to the final. The default MUST be false. The authenticated participant profile MUST include this field.

#### Scenario: Finalist profile

- **WHEN** a user has `passed_final` true
- **THEN** `/accounts/me/` (or equivalent profile for participants) MUST return `passed_final: true`

### Requirement: Navigation before publication

Before final results are published, cabinet menu items for stage 4 (semifinal results) and stage 5 (final) MUST be blocked with a waiting description equivalent to «Дождитесь решения жюри».

#### Scenario: Unpublished menu

- **WHEN** `final_results_published` is false
- **THEN** both stage 4 and stage 5 nav items MUST be blocked regardless of `passed_second_stage` or `passed_final`

### Requirement: Semifinal results menu after publication (variant B)

After final results are published, the stage 4 nav item («Результаты 2 этапа») MUST be accessible only to users with `passed_second_stage` true. Users without that flag MUST keep stage 4 blocked.

#### Scenario: Semifinalist sees stage 4

- **WHEN** results are published and the user has `passed_second_stage` true
- **THEN** stage 4 MUST be selectable in the cabinet menu

#### Scenario: Non-semifinalist blocked

- **WHEN** results are published and the user has `passed_second_stage` false
- **THEN** stage 4 MUST remain blocked

### Requirement: Final menu after publication (variant B)

After final results are published, the stage 5 nav item («Финал») MUST be accessible only to users with `passed_final` true. Semifinalists who did not pass to the final MUST NOT access stage 5.

#### Scenario: Finalist sees stage 5

- **WHEN** results are published and the user has `passed_final` true
- **THEN** stage 5 MUST be selectable in the cabinet menu

#### Scenario: Semifinalist not in final blocked on stage 5

- **WHEN** results are published, the user has `passed_second_stage` true and `passed_final` false
- **THEN** stage 5 MUST remain blocked

### Requirement: Semifinal results screen content

When results are published and the user opens stage 4, the system MUST show semifinal outcome text without personal scores. For a submitted practice form, the verdict MUST be «Работа прошла в финал» if `passed_final` is true, otherwise «Работа не прошла в финал». The user MUST be able to download the semifinal protocol PDF (same asset as on the public landing). If the practice form was not submitted in time, the system MUST show the same non-submission message pattern as stage 1 results.

#### Scenario: Semifinalist passed to final

- **WHEN** published, user opens stage 4, form status is submitted, and `passed_final` is true
- **THEN** the screen MUST show «Работа прошла в финал» and semifinal protocol download

#### Scenario: Semifinalist not in final

- **WHEN** published, user opens stage 4, form status is submitted, and `passed_final` is false
- **THEN** the screen MUST show «Работа не прошла в финал» and semifinal protocol download

### Requirement: Finalist congratulations screen content

When results are published and the user with `passed_final` true opens stage 5, the system MUST show a static congratulations message including: title «Поздравляем! Вы в финале конкурса «Лидеры транспортного образования»»; confirmation of finalist status; final dates 17–19 November 2026; business program and final presentation before the jury; invitation letter for business trips to universities and duplicate email to finalists; invitation to join the MAX finalists chat using `finalists_max_chat_link` when set; closing wishes.

#### Scenario: Finalist reads congratulations

- **WHEN** published, `passed_final` is true, user opens stage 5
- **THEN** the full congratulations text MUST be visible including dates and MAX chat paragraph

### Requirement: Direct URL guard

Direct navigation to stage 4 or stage 5 routes while results are unpublished, or without the required user flags, MUST NOT show verdict or congratulations content; the user MUST see an appropriate unavailable or unpublished message consistent with stage 1 results behavior.

#### Scenario: Unpublished direct URL

- **WHEN** user opens stage 4 or 5 URL while `final_results_published` is false
- **THEN** the screen MUST NOT show semifinal verdict or finalist congratulations

#### Scenario: Non-finalist direct URL to stage 5

- **WHEN** user opens stage 5 URL while published but `passed_final` is false
- **THEN** the screen MUST NOT show finalist congratulations
