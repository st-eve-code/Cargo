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

## Project Structure

- `app/` - routes, pages and API handlers (`app/api/*`)
- `components/` - shared UI components
- `lib/` - server helpers for admin auth, orders, mail, geocoding and routing
- `public/` - static images and icons
- `scripts/` - maintenance scripts

## Deploying

Run `npm run build` and then `npm run start`, or deploy to any platform that supports Next.js. Set the environment variables listed in your `.env` file on the host.
