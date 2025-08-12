# Digital TV Calculator (Vite + React + Tailwind)

Готовый проект для деплоя на GitHub Pages.

## Запуск локально
```bash
npm i
npm run dev
```

## Сборка
```bash
npm run build
```

Готовые файлы будут в папке `dist/`.

## Публикация на GitHub Pages
### Вариант A: gh-pages ветка через GitHub Actions
1. Закоммитьте код в репозиторий (ветка `main`).
2. Откройте Actions и включите воркфлоу **Deploy to GH Pages** (уже в проекте).
3. В Settings → Pages выберите **Deploy from a branch** → `gh-pages`.

### Вариант B: вручную из `dist/`
1. После `npm run build` создайте ветку `gh-pages` с содержимым `dist/`.
2. Выставьте Pages на `gh-pages`.

> При деплое в подпуть репозитория (`https://user.github.io/<repo>/`) убедитесь, что `base` в `vite.config.js` установлен в `'/<repo>/'`.
