# ShopSphere API

Express + MongoDB backend for the ShopSphere storefront. Mirrors the
request/response shapes the frontend's `src/services/*.js` files already
expect, so wiring the client up is a matter of swapping mock calls for
`fetch`/`axios` calls to these routes.

## Setup

```bash
cd server
npm install
cp .env.example .env   # then fill in MONGODB_URI and JWT_SECRET
npm run seed            # populates categories, products, demo users, orders
npm run dev              # starts on http://localhost:5000
```

Demo accounts after seeding (password for all: `password123`):
- `john@example.com` — user
- `admin@example.com` — admin

`npm run seed:destroy` wipes all collections without reseeding.

## Auth

JWT bearer tokens. Send `Authorization: Bearer <token>` on protected routes.
`POST /api/auth/register` and `POST /api/auth/login` return `{ user, token }`.

## Routes

| Method | Path | Access |
|---|---|---|
| POST | /api/auth/register | public |
| POST | /api/auth/login | public |
| POST | /api/auth/logout | public |
| GET | /api/auth/me | user |
| PUT | /api/auth/profile | user |
| POST | /api/auth/send-otp | public |
| POST | /api/auth/verify-otp | public |
| POST | /api/auth/forgot-password | public |
| POST | /api/auth/reset-password | public |
| GET | /api/products | public (query: category, minPrice, maxPrice, minRating, brand, sort) |
| GET | /api/products/search?q= | public |
| GET | /api/products/:id | public |
| GET | /api/products/:id/related | public |
| POST/PUT/DELETE | /api/products(/:id) | admin |
| GET | /api/categories | public |
| POST/PUT/DELETE | /api/categories(/:id) | admin |
| GET/POST/PUT/DELETE | /api/users(/:id) | admin |
| PATCH | /api/users/:id/toggle-status | admin |
| GET | /api/users/stats/summary | admin |
| GET | /api/orders | admin (query: status, paymentStatus) |
| GET | /api/orders/stats/summary | admin |
| GET | /api/orders/user/:userId | user |
| POST | /api/orders/user/:userId/progress | user — demo delivery simulator |
| GET | /api/orders/:id | user |
| POST | /api/orders | user |
| PATCH | /api/orders/:id/status | admin |
| PATCH | /api/orders/:id/payment-status | admin |
| PATCH | /api/orders/:id/cancel | user |
| GET | /api/notifications/user/:userId(/unread) | user |
| PATCH | /api/notifications/:id/read | user |
| PATCH | /api/notifications/user/:userId/read-all | user |

## Notes / known gaps

- `Register.jsx` on the frontend currently collects a password but doesn't
  send it to `authService.register`. The API requires `password` on
  register — that call needs a one-line fix when the frontend is wired up.
- OTP and password-reset endpoints are demo implementations: they return
  the code/token directly in the response instead of emailing it. Wire up
  a real mailer before shipping this to production.
