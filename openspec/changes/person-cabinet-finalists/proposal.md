# Proposal

## Why

После полуфинала участникам нужны официальные итоги второго этапа в личном кабинете, а финалистам — персональное поздравление и ссылка на чат в МАХ. Сейчас пункт «Результаты 2 этапа» показывает устаревшее расписание мастер-классов, а «Финал» — оценку чужих вебинаров; флага «прошёл в финал» и управляемой публикации итогов нет.

## What Changes

- Добавить на `CustomUser` булево поле `passed_final` («Прошёл в финал») и отдавать его в профиле участника (`/accounts/me/`).
- Добавить настройки `final_results_published` (публикация итогов полуфинала/финала в кабинете) и `finalists_max_chat_link` (URL чата финалистов в МАХ); seed в `import_settings`, хелперы в `core/utils/settings.py`.
- Management command по образцу `mark_semifinalists_passed_second_stage`: CSV `practice_name` → уникальное сопоставление с анкетой → `--apply` проставляет `passed_final=True` авторам (dry-run по умолчанию).
- **Вариант B (навигация):** после `final_results_published=true`:
  - пункт **04 «Результаты 2 этапа»** (`/person/workshop`) открывается **полуфиналистам** (`passed_second_stage`); вердикт «Работа прошла в финал» / «Работа не прошла в финал» по `passed_final`; протокол полуфинала (как на лендинге).
  - пункт **05 «Финал»** (`/person/evaluate`) открывается **только финалистам** (`passed_final`); статический текст поздравления с датами финала и ссылкой на МАХ из settings (если URL пуст — абзац про чат без кликабельной ссылки).
- До публикации оба пункта заблокированы с подписью «Дождитесь решения жюри»; прямой заход на маршруты не показывает вердикты и поздравление.
- Заменить содержимое `PersonStageWorkshop` и `PersonStageEvaluate` (или новые экраны на тех же маршрутах) под итоги и поздравление; логику `buildPersonStages` расширить по аналогии с `stage1_results_published`.

### Assumptions

- Список финалистов совпадает с данными полуфинала на лендинге (40 практик); проставление флага — ops-команда, не автоматически с лендинга.
- Участники без `passed_second_stage` не видят пункт 04 даже после публикации (им нечего показывать по полуфиналу).
- Соавторы анкет по-прежнему не получают флаги на отдельных аккаунтах.
- Лендинг «Итоги полуфинала» и `passed_second_stage` не меняются.

## Capabilities

### New Capabilities

- `person-final-results`: публикация итогов полуфинала/финала в кабинете (навигация, экраны 04/05, settings, протокол полуфинала, текст финалистам).
- `mark-finalists-ops`: ops-команда массового проставления `passed_final` авторам практик из CSV.

### Modified Capabilities

<!-- нет durable specs в main tree -->

## Impact

- **Backend:** `accounts/models.py`, миграция, serializers/views `me`, admin; `core/utils/settings.py`, `import_settings`, тесты settings; новая management command в `competition/management/commands/`.
- **Frontend:** `stages.ts` / `buildPersonStages`, `Person.tsx`, `PersonStageWorkshop`, `PersonStageEvaluate` (или замена), тип `IUser`, тесты навигации; `PROTOCOL_SEMIFINAL_LINK` уже есть в `lib.ts`.
- **Ops:** Roomie dry-run → apply → prod; затем staff: URL МАХ и `final_results_published=true`.
