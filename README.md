# Events App (EventFlow)

Приложение для управления событиями на Angular 21: создание, редактирование, удаление, избранное, регистрация, поиск, фильтрация и сортировка.  
Данные хранятся в `localStorage`, состояние экрана управляется через NgRx Store + Effects.

## Стек

- Angular 21 (standalone-компоненты, router)
- NgRx (`@ngrx/store`, `@ngrx/effects`, `@ngrx/entity`, `@ngrx/store-devtools`)
- Angular Material/CDK
- RxJS
- SCSS

## Быстрый старт

```bash
npm install
npm start
```

По умолчанию dev-сервер: `http://localhost:4200/`

## Скрипты

```bash
npm start      # ng serve
npm run build  # production build
npm test       # unit tests
```

## Что реализовано

- Список событий с карточками
- Создание и редактирование события через модальное окно
- Удаление события с подтверждением
- Пометка события как избранного
- Регистрация на событие (кнопка становится disabled после регистрации)
- Поиск (debounce + distinctUntilChanged)
- Фильтрация по статусу и категории
- Переключение вкладок `All Events` / `Registered`
- Сортировка:
  - по названию (A->Z, Z->A)
  - по дате (новые->старые, старые->новые)

## Описание архитектурных решений

- Использован `standalone`-подход без NgModule.
- Корневая композиция провайдеров в `src/app/app.config.ts`:
  - `provideStore({ events: eventsReducer })`
  - `provideEffects([EventsEffects])`
  - `provideStoreDevtools(...)`
  - `APP_INITIALIZER` для первичной инициализации сидов.
- Состояние событий хранится в `events`-feature через `@ngrx/entity`:
  - нормализованное хранилище (`ids`/`entities`)
  - статусы загрузки (`init | loading | loaded | error`)
  - селекторы для фильтров (статусы и категории).
- Side effects вынесены в `EventsEffects`:
  - загрузка, создание, удаление
  - favorite/register/edit
  - server-like поиск (через сервис).
- Доступ UI к стору абстрагирован через фасад `EventsFacade`.
- Источник данных - сервис `EventService` поверх `localStorage` + `BehaviorSubject`.

## Описание реализованных опциональных функций

- Автосидирование демо-данных при пустом `localStorage`:
  - `src/app/seeds/seed-events.ts`
  - `src/app/seeds/event-seed.service.ts`
  - включается флагом `defaultSeedConfig.seedEvents` в `src/app/seeds/seed-config.ts`.
- Расширенные пользовательские фильтры и сортировка в UI.
- Отдельный режим просмотра зарегистрированных событий.
- Поддержка избранного (`favorite`) и регистрации (`registered`) на уровне модели и состояния.

## Структура проекта

```text
src/app/
  app.config.ts                 # DI + Store + Effects + APP_INITIALIZER
  app.routes.ts                 # роутинг
  models/event.model.ts         # модель EventISO
  services/event.service.ts     # CRUD + localStorage
  events/
    data/                       # NgRx actions/reducer/effects/selectors/facade
    events-list/                # основной экран списка
      event-card/               # карточка события
    event-create/               # форма создания/редактирования
  seeds/                        # seed-конфиг, seed-данные, seed-сервис
```

## Тестирование

В проекте есть unit-тесты для:

- корневого приложения (`app.spec.ts`)
- экрана списка (`events-list.spec.ts`)
- карточки (`event-card.spec.ts`)
- формы (`event-create.spec.ts`)
- seed-сервиса (`event-seed.service.spec.ts`)

Запуск:

```bash
npm test
```

## Сборка

```bash
npm run build
```

Артефакты сборки размещаются в `dist/`.
