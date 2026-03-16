# Next.js Full-Stack Complete eCommerce Solution

A Complete and full-stack eCommerce platform built with Next.js. Launch your online store with core features like product management, secure Stripe payments, built-in custom CMS, and responsive design. Enjoy full control, lifetime free updates, and comprehensive documentation to build, develop, and scale your store effortlessly.

#### [🌐 Visit Website](https://cozycommerce.dev/)

#### [📑 Explore Docs](https://cozycommerce.dev/docs)

#### [🚀 Live Demo](https://demo.cozycommerce.dev/)

CozyCommerce is powerful full-stack, self-hosted eCommerce solution built with Next.js. Featuring one-click deployment, this platform offers seamless scalability, custom CMS integration, and secure payments—perfect for creating and managing your online store with ease.

This is the free Lite version of CozyCommerce, featuring a basic landing page to establish your online presence. It does not include advanced functionality or CMS features like product management or payment processing. Get a premium plan for full e-commerce tools.

| ✨ Features                         | 🎁 CozyCommerce Free                 | 🔥 CozyCommerce Pro                        |
|----------------------------------|--------------------------------|--------------------------------------|
| Next.js Pages                    | Static                         | Dynamic Boilerplate Template         |
| Custom CMS                       | Not Included                        | All According to Demo                |
| eCommerce Features          | Not Included                       | Included                             |
| Integrations (DB, Auth, etc.)    | Not Included                   | Included                             |
| Community Support                | Included                       | Included                             |
| Premium Email Support            | Not Included                   | Included                             |
| Lifetime Free Updates            | Included                       | Included                             |

# CozyCommerce Installation

Welcome to **CozyCommerce** — a modern, high-performance ecommerce solution based on Next.js built for scalability and developer productivity.

This guide will walk you through setting up the project locally and deploying it to production using Vercel. Whether you're building an e-commerce MVP or scaling an enterprise storefront, CozyCommerce offers the tools and structure to get started quickly.

---

## 🚧 Prerequisites

Before you begin, ensure that the following tools are installed on your machine:

* **[Node.js](https://nodejs.org/)** version 20.0.9 or higher
* **[npm](https://www.npmjs.com/)** version 10.0.0 or higher
* **[Git](https://git-scm.com/)** for version control

We recommend using a version manager like [`nvm`](https://github.com/nvm-sh/nvm) to manage Node.js versions easily.

---

## ⚙️ Environment Setup

Create a `.env` file in the root directory and add the following environment variables:

```env
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
SITE_URL="http://localhost:3000"
SITE_NAME="CozyCommerce"
GITHUB_CLIENT_SECRET="your_github_client_secret"
GITHUB_CLIENT_ID="your_github_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
GOOGLE_CLIENT_ID="your_google_client_id"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your_stripe_publishable_key"
STRIPE_SECRET_KEY="your_stripe_secret_key"
NEXT_PUBLIC_SUCCESS_URL="http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}"
NEXT_PUBLIC_CANCEL_URL="http://localhost:3000"
NEXT_PUBLIC_ALGOLIA_PROJECT_ID="your_algolia_project_id"
NEXT_PUBLIC_ALGOLIA_WRITE_API_KEY="your_algolia_write_api_key"
NEXT_PUBLIC_ALGOLIA_INDEX="your_algolia_index"
EMAIL_SERVER_HOST="smtp.resend.com"
EMAIL_SERVER_PORT=465
EMAIL_SERVER_USER="resend"
EMAIL_SERVER_PASSWORD="your_resend_api_key"
EMAIL_FROM="your_email"
ADMIN_EMAILS="admin@example.com"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
DATABASE_URL="your_database_url"
NEXTAUTH_SECRET="your_nextauth_secret"
FORMBOLD_FORM_ID="your_formbold_form_id"
```

> ⚠️ **Important:** Replace the placeholder values with your actual API keys and credentials. Never commit your `.env` file to version control to protect sensitive data.

---

## 📦 Installation Steps

Follow these steps to get the project running locally:

1. **Install project dependencies:**

   ```bash
   npm install
   ```

2. **Generate the Prisma client (for database access):**

   ```bash
   npx prisma generate
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

Once the server is running, you can access your local store at: [http://localhost:3000](http://localhost:3000)

---

## ☁️ Deployment on Vercel

Deploy your CozyCommerce store in minutes using [Vercel](https://vercel.com):

1. **Push your code to GitHub** (or another supported Git provider like GitLab or Bitbucket).

2. **Log in to [Vercel](https://vercel.com)** and click “Import Project.”

3. **Connect your Git repository**, then:

   * Select **Next.js** as the framework preset.
   * Add all required environment variables from your `.env` file under the "Environment Variables" section.
   * For your database, use a cloud service like [Neon](https://neon.tech) and provide the connection string in `DATABASE_URL`.

4. **Click "Deploy"** — Vercel will handle the rest, including continuous deployment on every push to your main branch.

5. After deployment, you’ll receive a Vercel-hosted URL. You can also [add a custom domain](https://vercel.com/docs/concepts/projects/domains) if needed.

---

## 🔌 Required Third-Party Services

To enable full functionality, set up the following services and add the relevant credentials to your `.env` file:

1. **[Neon](https://neon.tech)** — PostgreSQL database with serverless autoscaling.
2. **[Cloudinary](https://cloudinary.com)** — Image storage, optimization, and delivery.
3. **[Stripe](https://stripe.com)** — Payment processing and checkout.
4. **[Algolia](https://www.algolia.com)** — Lightning-fast search powered by AI.
5. **[Resend](https://resend.com)** — Transactional email delivery via SMTP or API.
6. **[GitHub OAuth](https://github.com/settings/developers)** / [Google OAuth](https://console.cloud.google.com/apis/credentials)\*\* — Enable social login functionality.
7. **[Formbold](https://formbold.com)** — Simple form backend for contact forms and submissions.

---

## 📚 Additional Documentation

Explore our full documentation for deeper integration guidance:

* [Database Integration](https://cozycommerce.dev/docs/database)
* [Authentication](https://cozycommerce.dev/docs/authentication)
* [Payment Gateways](https://cozycommerce.dev/docs/stripe)
* [Algolia - AI-Powered Search](https://cozycommerce.dev/docs/algolia)
* [Cloudinary - Image Hosting](https://cozycommerce.dev/docs/cloudinary)
* [Email - Transactional/SMTP](https://cozycommerce.dev/docs/email)
* [Admin Access](https://cozycommerce.dev/docs/admin-access)

---

Need help? Feel free to reach out or open an issue on the [GitHub repository](https://github.com/CozyCommerce/cozycommerce-lite). Happy coding! 🎉

## Update Logs

Version 1.4.0 - Enhancements - [Mar 16, 2026]

- upgrade dependencies, refactor Prisma configuration, apply consistent image styling