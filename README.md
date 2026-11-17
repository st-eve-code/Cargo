# Cargo (PioneerCargo Solutions)

Marketing site, shipment tracking, quote and order intake, and an admin console for the Cargo / PioneerCargo logistics business. Built with [Next.js](https://nextjs.org) (App Router), React, Tailwind CSS, GSAP and Leaflet.

## Features

- **Public pages:** home, about, services, contact, request a quote, and place an order.
- **Tracking:** customers look up a shipment and see its route on a map.
- **Admin console:** password-protected page for reviewing and updating orders.
- **Email:** contact and order notifications sent over SMTP.

## Getting Started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run admin:password` | Set the admin console password (writes to `.env`) |

## Configuration

Copy `.env.example` to `.env` and fill in the values. The file documents every setting:

- `NEXT_PUBLIC_SITE_*` - company name, contact details, address and opening hours shown on the site
- `NEXT_PUBLIC_SOCIAL_*` - footer social links
- `SMTP_*` and `MAIL_FROM` - email for the contact and quote forms
- `ADMIN_PASSWORD_HASH` - set with `npm run admin:password -- "your password"`
- `ORDERS_FILE` and `ORDERS_BACKUP_KEEP` - where orders are saved and how many backups to keep

Restart the dev server after changing `.env`.

## Project Structure

- `app/` - routes, pages and API handlers (`app/api/*`)
- `components/` - shared UI components
- `lib/` - server helpers for admin auth, orders, mail, geocoding and routing
- `public/` - static images and icons
- `scripts/` - maintenance scripts

## Deploying

Run `npm run build` and then `npm run start`, or deploy to any platform that supports Next.js. Set the environment variables listed in your `.env` file on the host.
