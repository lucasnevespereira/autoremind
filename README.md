# AutoRemind

<div align="center">

<img src="src/assets/logo-square.png" alt="AutoRemind Logo" width="200" style="padding: 20px;" />

**Automated SMS Reminder System for Small Businesses**

Send automated SMS reminders to your clients for appointments, services, or any scheduled events.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[Features](#-features) • [Getting Started](#-getting-started) • [Usage](#-usage) • [License](#-license)

</div>

---

## ✨ Features

- 📱 **Automated SMS Reminders** - Send reminders via Twilio
- 👥 **Client Management** - Simple interface for managing clients and appointments
- 🌍 **Multi-language** - English, Portuguese, and French support
- ⚙️ **Customizable Templates** - Personalize your SMS messages
- 📅 **Smart Scheduling** - Set reminder days before appointments
- 📊 **Easy Import/Export** - Bulk import clients via Excel
- 🔐 **Secure** - Email authentication and encrypted credentials
- 📱 **Responsive** - Works on desktop and mobile

---

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- Docker (for local development)
- Twilio account ([Sign up free](https://www.twilio.com/try-twilio))

### Quick Start

1. Clone the repository:
```bash
git clone https://github.com/lucasnevespereira/autoremind.git
cd autoremind
```

2. Start development environment with Docker:
```bash
make dev
```

This command will:
- Start PostgreSQL in Docker
- Install dependencies
- Setup the database
- Launch the development server

3. Visit [http://localhost:3000](http://localhost:3000)

---

## 🚀 Usage

### 1. Initial Setup

- Create an account at `/sign-up`
- Go to **Settings** and configure:
  - Twilio credentials (Account SID, Auth Token, Phone Number)
  - Business information
  - SMS template with variables:
    - `{client_name}` - Client's name
    - `{client_resource}` - Service/resource type
    - `{reminder_date}` - Appointment date
    - `{business_name}` - Your business name
    - `{business_contact}` - Your contact info

### 2. Add Clients

- Click **Add Client** or **Import Excel**
- Fill in: Name, Phone, Resource, Date
- Manage clients from the dashboard

### 3. Send Reminders

**Manual:** Click the send button next to any client

**Automatic:** Setup cron job (daily at 9 AM):
```json
{
  "crons": [{
    "path": "/api/cron/reminders",
    "schedule": "0 9 * * *"
  }]
}
```

---

## 🌐 Deployment

Deploy to [Vercel](https://vercel.com) (recommended):

1. Push to GitHub
2. Import on Vercel
3. Add environment variables
4. Deploy

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file

---

<div align="center">

**Built with ❤️ for small businesses worldwide**

[Report Bug](https://github.com/lucasnevespereira/autoremind/issues) • [Request Feature](https://github.com/lucasnevespereira/autoremind/issues)

</div>
