Проект представляет собой образовательный портал, на котором возможно обсуждать идеи, решать интересные задачи, загружать свои материалы и создавать виртуальные классы. Так-же сайт предоставляет функции регистрации (с помощью JWT а так-же вход через сторонние сервисы) и разделения на роли (учитель/ученик/администратор), сбора и анализа статистики. Для удобной навигации предусмотренна система тегов и категорий. На сайте есть интерактивные элементы (тесты) и раздел подготовки к экзаменам. Сайт использует ассинхронную и ленивую загрузку компонентов. Используется кеш для хранения информации, за счет чего реакция на действия пользователя моментальна. Сайт доступен на любых устройствах. Экран разбит на компоненты.

Вы можете зайти на наш сайт и опробовать по следующей ссылке: 
https://school-journal-chi.vercel.app/


Инструкция по установке/развертыванию:
Клонируйте этот репозиторий:
```
git clone https://github.com/NSinecode/school-journal.git
```
Дальше, создайте репозиторий на гитхабе, откройте powershell (аналог) и впишите следующие команды:
```
git remote add origin https://github.com/{ваш аккаунт на github}/{ваш репозиторий}.git
git branch -M main
git push -u origin main
git add .
git commit -m "initial commit"
git push
```

Потом, вам надо создать аккаунты на vercel.com (связаняй с гит-хабом).

На первом сайте вам надо нажать: 
Add New...
Project
Adjust GitHub App Permissions
Ваш профиль
Only select repositories
Select repositories
Ваш репозиторий
Save
Import
Deploy
Дальше, на главной странице сайта выберите ваш репозиторий
Settings
Environmental Variables

Вюда надо будет вводить api ключи которые написанные ниже (в поле key - название, в поле value - значение). Чтобы добавить еще один ключ нажмите Add Another:
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login

Из supabase.com и clerk.com вам надо получить такие API ключи и вставить в vercel:
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_URL=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
DATABASE_URL=

После ввода всего, нажмите Save
Дальше нажмите Deployments(в верхнем левом углу страницы)
