# Design

## Context

See proposal.md — Why. Кабинет: `personStages` id 4 → `/person/workshop` (`PersonStageWorkshop`, мастер-классы), id 5 → `/person/evaluate` (`PersonStageEvaluate`, оценка вебинаров). Разблокировка сейчас по `unlockedThroughId >= stage.id` плюс отдельные правила для id 2 (`stage1_results_published`) и id 3 (`passed_second_stage`). Settings: `GET /settings/` с `parse_setting_value` для bool. Полуфинал: `passed_second_stage`, протокол полуфинала на лендинге — `PROTOCOL_SEMIFINAL_LINK` (`/protocol-semifinal.pdf`). Проставление полуфиналистов — `mark_semifinalists_passed_second_stage` + `semifinalist_matching.py`.

## Goals / Non-Goals

**Goals:**

- Поле `passed_final`, settings `final_results_published` и `finalists_max_chat_link`, хелперы и seed.
- Вариант **B**: id 4 для `passed_second_stage` после публикации; id 5 только для `passed_final`.
- Экраны итогов полуфинала и поздравления финалистам на существующих маршрутах.
- Ops-команда `mark_finalists_passed_final` (клон логики semifinal command).

**Non-Goals:**

- Не менять лендинг, expert/staff API, правила второго этапа (видео, materials).
- Не показывать персональные баллы полуфинала.
- Не автоматически синхронизировать флаг с Google Sheet / mock лендинга.
- Не восстанавливать оценку вебинаров на id 5.

## Decisions

1. **Settings keys**
   - `final_results_published`: семантика как `stage1_results_published` — только явный `true`.
   - `finalists_max_chat_link`: произвольная строка URL; фронт рендерит `Link` только если `trim().length > 0`.
   - Seed в `import_settings`: `false` и пустая ссылка; staff правит без деплоя.

2. **`buildPersonStages`**
   - Добавить параметры `finalResultsPublished`, `passedFinal` (и уже есть `passedSecondStage`).
   - Константы `STAGE2_RESULTS_STAGE_ID = 4`, `FINAL_STAGE_ID = 5`.
   - Id 4: `default` iff `finalResultsPublished && passedSecondStage`; иначе `block` + «Дождитесь решения жюри» если не published.
   - Id 5: `default` iff `finalResultsPublished && passedFinal`; иначе `block`.
   - Остальные id без изменения логики (id 2/3 как сейчас).

3. **`Person.tsx`**
   - State `isFinalResultsPublished` из `settings.final_results_published === true`.
   - Прокинуть в `buildPersonStages` вместе с `currentUser.passed_final` (новое поле).
   - Props на экраны: флаги публикации, `maxChatLink` из settings (строка).

4. **Stage 4 — `PersonStageWorkshop` (переписать UI)**
   - По образцу `PersonStageResults`: guard unpublished; `getFormData` для submitted/draft; вердикт по `passed_final`; кнопка «Скачать протокол» → `PROTOCOL_SEMIFINAL_LINK`.
   - Убрать вызов `getWebinars` и контент мастер-классов.

5. **Stage 5 — `PersonStageFinal` или переписать `PersonStageEvaluate`**
   - Guard: published + `passed_final`; иначе заглушки как на stage 1.
   - Статический JSX с абзацами пользовательского текста; блок МАХ: текст + `Link` при непустом URL.
   - Заголовок H2: «Поздравляем! Вы в финале конкурса «Лидеры транспортного образования»».
   - Стили: `person-stage__title`, `person-stage__subtitle`, welcome-блок по аналогии со slides.

6. **Backend model & API**
   - `CustomUser.passed_final` + migration `000x_customuser_passed_final`.
   - `accounts/serializers.py`, `accounts/views.py` (me), `accounts/admin.py` — зеркало `passed_second_stage`.
   - Frontend `IUser.passed_final`.

7. **Mark finalists command**
   - `competition/management/commands/mark_finalists_passed_final.py` — скопировать структуру semifinal command, поле `passed_final`, отчётные метки DECISION_* переиспользовать или добавить `DECISION_ALREADY_FINAL`.
   - Тесты: `test_mark_finalists_command.py` по аналогии с semifinal.

8. **Tests**
   - `buildPersonStages` unit: комбинации published × passed_second_stage × passed_final для id 4/5.
   - `core/test_settings.py`: `is_final_results_published`, `get_finalists_max_chat_link`.
   - Опционально RTL smoke для экрана финала (published + passed_final).

## Risks / Trade-offs

- [Пользователь не видит `passed_final` после apply] → перелогин или refresh `/me`; документировать в tasks.
- [Пустая ссылка МАХ при включённой публикации] → ops checklist: сначала URL, потом publish.
- [Id 5 route name `evaluate` misleading] → оставить URL для совместимости закладок; контент другой.

## Migration Plan

1. Deploy backend: migration + settings seed + command (без apply).
2. Deploy frontend с новыми экранами и menu rules (publish still false).
3. Roomie: dry-run → apply `mark_finalists_passed_final`; сверка unmatched.
4. Prod: dry-run → apply.
5. Staff: `finalists_max_chat_link` = URL; `final_results_published` = true.
6. Rollback publish: setting false; rollback flags only via admin/command if needed.

## Open Questions

Нет.
