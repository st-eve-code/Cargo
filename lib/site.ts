/* Company details shown across the whole website. Set them in .env (NEXT_PUBLIC_SITE_* variables),
   then restart the dev server. Each value falls back to the text in brackets when its variable is empty. */
export const site = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "PioneerCargo Solutions",
  shortName: process.env.NEXT_PUBLIC_SITE_SHORT_NAME || "PioneerCargo",
  email: process.env.NEXT_PUBLIC_SITE_EMAIL || "hello@yourdomain.com",
  phone: process.env.NEXT_PUBLIC_SITE_PHONE || "+1 (800) 000-0000",
  address: process.env.NEXT_PUBLIC_SITE_ADDRESS || "Your street address, City, Country",
  hours: process.env.NEXT_PUBLIC_SITE_HOURS || "24/7 Global Support",
  copyrightYear: process.env.NEXT_PUBLIC_SITE_COPYRIGHT_YEAR || String(new Date().getFullYear()),
  /* the public address of the website, used for the sitemap and for links shared on social media */
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  /* social media links shown in the footer. An empty value hides that icon. */
  social: {
    facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || "",
    telegram: process.env.NEXT_PUBLIC_SOCIAL_TELEGRAM || "",
    instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || "",
  },
};
