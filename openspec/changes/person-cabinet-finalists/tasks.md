# Tasks

## 1. Backend: модель и settings

- [x] 1.1 Добавить `CustomUser.passed_final`, миграцию, поле в admin/serializers/me и тест фильтра admin по аналогии с `passed_second_stage`; проверка: `python manage.py migrate` и тесты accounts проходят
- [x] 1.2 Добавить ключи `final_results_published` и `finalists_max_chat_link` в `import_settings`, константы и хелперы `is_final_results_published()` / `get_finalists_max_chat_link()` в `core/utils/settings.py`; проверка: расширить `core/test_settings.py`, pytest green

## 2. Backend: mark finalists command

- [x] 2.1 Реализовать `mark_finalists_passed_final` (CSV, dry-run, `--apply`, отчёт) переиспользуя `semifinalist_matching`; проверка: `test_mark_finalists_command.py` green
- [x] 2.2 Подготовить CSV финалистов (40 practice_name с лендинга/Лист 3) для ops dry-run; проверка: dry-run на Roomie без unmatched кроме ожидаемых

## 3. Frontend: навигация и типы

- [x] 3.1 Добавить `passed_final` в `IUser` и убедиться, что login/me кладёт флаг в store; проверка: TypeScript build без ошибок
- [x] 3.2 Расширить `buildPersonStages(finalResultsPublished, passedFinal, …)` правилами id 4/5 (вариант B); проверка: unit-тесты stages (новый файл или расширение существующих) green

## 4. Frontend: экраны кабинета

- [x] 4.1 Переписать `PersonStageWorkshop` под итоги полуфинала (guard publish, form status, вердикт, `PROTOCOL_SEMIFINAL_LINK`); проверка: RTL или ручной сценарий в dev + unit/guard tests при наличии
- [x] 4.2 Заменить содержимое `PersonStageEvaluate` поздравлением финалиста (полный текст, MAX link из settings prop); проверка: dev при mock `passed_final` + settings
- [x] 4.3 В `Person.tsx` загрузить `final_results_published` и `finalists_max_chat_link`, прокинуть в `buildPersonStages` и экраны; проверка: заблокированные пункты до publish, id 4/5 по флагам после publish

## 5. Сборка и деплой

- [x] 5.1 `npm run build` во frontend и pytest backend по затронутым модулям; проверка: build success, tests green
- [x] 5.2 Push backend и frontend; на Roomie/prod: dry-run → apply command, staff URL МАХ + `final_results_published=true`; проверка: финалист видит 04/05, полуфиналист без финала только 04

## Workflow follow-up

- После ревью: `/opsx-archive` для change `person-cabinet-finalists` по процессу проекта.
