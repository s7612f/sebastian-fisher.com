# sebastian-fisher.com Deployment Guide

## 🎉 Website Successfully Deployed!

Your website is live at: **http://192.168.1.77:3000**

## 📋 Admin Access

**Login Credentials:**
- URL: http://192.168.1.77:3000/login
- Email: contact@sebastian-fisher.com
- Password: AdminPassword123

**⚠️ Important:** Change your admin password after first login!

## 🚀 Features

### User Features
- ✅ User registration with email validation
- ✅ Secure password-protected login
- ✅ Account requires admin approval before access
- ✅ Contact form to message admin
- ✅ Dark mode toggle
- ✅ Fully responsive design

### Admin Features
- ✅ Admin dashboard to approve/reject users
- ✅ Email notifications for new registrations
- ✅ User management interface

## 🔧 Server Management

### Start the Application
```bash
ssh sebastian@192.168.1.77
cd ~/sebastian-fisher.com
npm start
```

### Stop the Application
```bash
pkill -f "next start"
```

### View Logs
```bash
tail -f ~/sebastian-fisher-app.log
```

### Restart the Application
```bash
pkill -f "next start"
cd ~/sebastian-fisher.com
nohup npm start > ~/sebastian-fisher-app.log 2>&1 &
```

## 📁 File Locations

- **Application:** `~/sebastian-fisher.com/`
- **Database:** `~/sebastian-fisher.com/prisma/dev.db`
- **Logs:** `~/sebastian-fisher-app.log`
- **Environment:** `~/sebastian-fisher.com/.env`

## ⚙️ Configuration

### Email Setup
To enable email notifications, update these values in `.env`:

```bash
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="your-email@gmail.com"
ADMIN_EMAIL="contact@sebastian-fisher.com"
```

**For Gmail:**
1. Enable 2-factor authentication
2. Generate an App Password at: https://myaccount.google.com/apppasswords
3. Use the App Password in EMAIL_SERVER_PASSWORD

### Security Settings
Generate a secure secret for production:
```bash
openssl rand -base64 32
```

Update `NEXTAUTH_SECRET` in `.env` with the generated value.

## 🗄️ Database Management

### Create a New Admin User
```bash
cd ~/sebastian-fisher.com
npx tsx scripts/create-admin.ts [email] [password] [name]
```

### Run Migrations
```bash
cd ~/sebastian-fisher.com
npx prisma migrate deploy
```

### View Database
```bash
cd ~/sebastian-fisher.com
npx prisma studio
```

## 🔄 Updating the Website

### 1. On Your Mac (Development)
```bash
cd /Users/sebastianfisher/sebastian-fisher.com
# Make your changes
npm run build  # Test the build
```

### 2. Deploy to Server
```bash
# Create tarball (excluding node_modules and .next)
tar -czf ../sebastian-fisher-build.tar.gz --exclude=node_modules --exclude=.next --exclude=.git .

# Transfer to server
scp /Users/sebastianfisher/sebastian-fisher-build.tar.gz sebastian@192.168.1.77:~/

# On server: Extract and rebuild
ssh sebastian@192.168.1.77
cd ~/sebastian-fisher.com
tar -xzf ~/sebastian-fisher-build.tar.gz
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
npm install --legacy-peer-deps
npm run build
pkill -f "next start"
nohup npm start > ~/sebastian-fisher-app.log 2>&1 &
```

## 🛠️ Tech Stack

- **Framework:** Next.js 16 with TypeScript
- **Database:** SQLite with Prisma ORM
- **Authentication:** NextAuth v5
- **Styling:** TailwindCSS
- **Email:** Nodemailer
- **Hosting:** Self-hosted on local server

## 📖 User Workflow

1. **New User Registration:**
   - User visits http://192.168.1.77:3000/register
   - Fills out registration form
   - Receives message: "Account pending approval"
   - Admin receives email notification

2. **Admin Approval:**
   - Admin logs in to http://192.168.1.77:3000/admin
   - Reviews pending users
   - Clicks "Approve" or "Reject"
   - User receives email notification

3. **User Login:**
   - Approved user visits http://192.168.1.77:3000/login
   - Logs in with credentials
   - Access dashboard and can send messages via contact form

## 🐛 Troubleshooting

### Port Already in Use
```bash
ssh sebastian@192.168.1.77
lsof -ti:3000 | xargs kill -9
```

### Database Issues
```bash
cd ~/sebastian-fisher.com
rm prisma/dev.db
npx prisma migrate deploy
npx tsx scripts/create-admin.ts contact@sebastian-fisher.com AdminPassword123 Sebastian
```

### Application Won't Start
```bash
# Check logs
tail -100 ~/sebastian-fisher-app.log

# Verify Node.js is loaded
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
node --version  # Should show v24.11.0

# Rebuild
cd ~/sebastian-fisher.com
rm -rf .next
npm run build
```

## 📞 Support

For issues or questions, check the logs at `~/sebastian-fisher-app.log` on the server.

---

**Built with ❤️ using Next.js and deployed on November 1, 2025**
