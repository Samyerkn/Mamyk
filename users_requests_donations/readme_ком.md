cat > README_КОМАНДА.md << 'EOF'
# Мамык — инструкция для команды

## Как начать работу (один раз)
1. Скачай VS Code: https://code.visualstudio.com
2. Открой терминал и выполни:
git clone https://github.com/Samyerkn/Mamyk.git
cd Mamyk
git checkout feature/ТВОЯ_ВЕТКА

## Твоя ветка
- Самал → feature/backend-a (уже работает)
- Бэкенд B → feature/backend-b
- Фронтенд A → feature/frontend-a
- Фронтенд B → feature/frontend-b
- Фронтенд C → feature/frontend-c

## Каждый раз когда поработала
1. VS Code → иконка ветки слева (Source Control)
2. Напиши что сделала
3. Нажми ✓ Commit
4. Нажми Sync Changes ↑

## Получить чужие изменения
Нажми Sync Changes ↓ в VS Code

## Что уже готово (Самал — Бэкенд A)
✅ Модели: User, HelpRequest, Donation
✅ API авторизации: регистрация, вход, JWT токен
✅ API заявок: создание, лента, мои заявки
✅ API донатов: взнос, история, по заявке
✅ Сервер запускается: python3 manage.py runserver

## Что нужно каждому участнику
Бэкенд B (feature/backend-b):
- Модели Product, ProductSize, Order
- API каталога и заказов

Фронтенд A (feature/frontend-a):
- Главная страница, регистрация, вход
- Подключается к: /api/auth/...

Фронтенд B (feature/frontend-b):
- Каталог, товар, оформление заказа
- Подключается к: /api/products/, /api/orders/...

Фронтенд C (feature/frontend-c):
- Заявки, лента, спонсорство
- Подключается к: /api/requests/, /api/donations/...
EOF
