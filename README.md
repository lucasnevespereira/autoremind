# 🚗 AutoRemind

<div align="center">

<img src="src/assets/logo-square.png" alt="AutoRemind Logo" width="400" style="padding: 20px;" />

**Automatic Maintenance Reminder System for Auto Garages**

A modern, bilingual (English/Portuguese) web application that helps auto mechanics and garages send automated SMS reminders to their clients when their vehicle maintenance is due.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Usage](#-usage) • [Contributing](#-contributing) • [License](#-license)

</div>

---

## ✨ Features

- 🌍 **Bilingual Support** - Full English and Portuguese translations
- 🔐 **Secure Authentication** - Email-based authentication with Better Auth
- 📱 **Automated SMS Reminders** - Send maintenance reminders via Twilio
- 👥 **Client Management** - Easy-to-use interface for managing clients
- 📅 **Smart Scheduling** - Automatic reminders 7 days before maintenance date
- ⚙️ **Customizable Templates** - Personalize SMS message templates
- 🎨 **Modern UI/UX** - Clean, fintech-inspired design with shadcn/ui
- 📊 **Data Table** - Sortable, searchable client list with pagination
- 🔄 **Real-time Updates** - Instant updates using Next.js Server Actions
- 🌙 **Responsive Design** - Works seamlessly on desktop and mobile devices

---

## 🛠️ Tech Stack

### Frontend

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful, accessible components
- **[TanStack Table](https://tanstack.com/table)** - Powerful data tables
- **[Lucide Icons](https://lucide.dev/)** - Clean, consistent icons

### Backend

- **[PostgreSQL](https://www.postgresql.org/)** - Robust relational database
- **[Drizzle ORM](https://orm.drizzle.team/)** - Type-safe database toolkit
- **[Better Auth](https://www.better-auth.com/)** - Modern authentication solution
- **[Twilio](https://www.twilio.com/)** - SMS delivery service

### Additional Tools

- **[date-fns](https://date-fns.org/)** - Modern date utility library
- **[React Hook Form](https://react-hook-form.com/)** - Performant forms
- **Server Actions** - Type-safe server mutations

---

## 📦 Getting Started

### Prerequisites

- **Node.js** 18+ and npm/yarn/pnpm
- **PostgreSQL** database (local or cloud-hosted)
- **Twilio Account** (for SMS functionality)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/autoremind.git
cd autoremind
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Fill in your environment variables:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/autoremind

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000

# Cron Job Protection
CRON_SECRET=your-random-secret-here
```

4. **Set up the database**

```bash
npm run db:push
```

5. **Start the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Usage

### Initial Setup

1. **Create an account** at `/sign-up`
2. Navigate to **Settings** to configure Twilio
3. Add your Twilio credentials:
   - Account SID
   - Auth Token
   - Phone Number (E.164 format: +1234567890)
4. Customize your SMS template with variables:
   - `{client_name}` - Client's name
   - `{vehicle}` - Car model
   - `{date}` - Maintenance date
   - `{garage_name}` - Your business name

### Managing Clients

1. Click **Add Client** on the dashboard
2. Fill in client details:
   - Name
   - Phone number
   - Vehicle make/model
   - Maintenance date
3. View, edit, or delete clients from the table

### Sending Reminders

**Manual Reminders:**

- Click the **Send** button next to any client

**Automatic Reminders (Cron Job):**

- Set up a cron job to call: `GET /api/cron/reminders`
- Include header: `Authorization: Bearer YOUR_CRON_SECRET`

**Example with Vercel Cron:**

Create `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/reminders",
      "schedule": "0 9 * * *"
    }
  ]
}
```

### Language Switching

Users can switch between English and Portuguese using the language selector in the footer. The preference is saved to localStorage.

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/autoremind)

1. Push your code to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Add environment variables
4. Configure Vercel Cron for automated reminders
5. Deploy!

### Other Platforms

AutoRemind can be deployed to any platform that supports Next.js:

- **[Railway](https://railway.app/)**
- **[Render](https://render.com/)**
- **[Fly.io](https://fly.io/)**

Ensure you:

- Set all environment variables
- Have a PostgreSQL database
- Configure external cron jobs if not using Vercel

---

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Lint code with ESLint

# Database
npm run db:generate  # Generate Drizzle migrations
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio (visual DB interface)
```

### Project Structure

```
autoremind/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── (app)/        # Authenticated routes
│   │   ├── (auth)/       # Authentication pages
│   │   └── api/          # API routes
│   ├── components/       # React components
│   │   ├── ui/           # shadcn/ui components
│   │   └── auth/         # Auth-specific components
│   ├── contexts/         # React contexts (Language)
│   ├── db/               # Database schema & config
│   ├── lib/              # Utility functions
│   └── assets/           # Static assets (logos, images)
├── public/               # Public static files
└── drizzle/              # Database migrations
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

### Adding Translations

To add a new language:

1. Update `src/lib/i18n.ts` with new translations
2. Add the language to the `Language` type
3. Update the language selector in `AppFooter`

---

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature idea? Please [open an issue](https://github.com/yourusername/autoremind/issues) with:

- **Bug Reports**: Detailed description, steps to reproduce, expected vs actual behavior
- **Feature Requests**: Use case, proposed solution, any alternatives considered

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Better Auth](https://www.better-auth.com/) for modern authentication
- [Twilio](https://www.twilio.com/) for reliable SMS delivery
- [Vercel](https://vercel.com/) for seamless deployment
- All [contributors](https://github.com/lucasnevespereira/autoremind/graphs/contributors) who help improve AutoRemind

---

## 📊 Roadmap

- [ ] Multi-tenant support (multiple garages)
- [ ] Email notifications as alternative to SMS
- [ ] Dashboard with analytics and statistics
- [ ] Mobile app (React Native)
- [ ] WhatsApp integration
- [ ] Customer portal for self-service booking
- [ ] Recurring maintenance schedules
- [ ] PDF invoice generation
- [ ] Multi-language support (Spanish, French, German)

---

## 📞 Support

Need help? Here are some resources:

- 💬 [Discussions](https://github.com/lucasnevespereira/autoremind/discussions)
- 🐛 [Issue Tracker](https://github.com/lucasnevespereira/autoremind/issues)

---

## ⭐ Star History

If you find AutoRemind helpful, please consider giving it a star! ⭐

---

<div align="center">

**Built with ❤️ for auto mechanics and garages worldwide**

[Website](https://autoremind.app) • [Report Bug](https://github.com/yourusername/autoremind/issues) • [Request Feature](https://github.com/yourusername/autoremind/issues)

</div>
