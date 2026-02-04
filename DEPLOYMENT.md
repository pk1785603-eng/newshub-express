# 24x7 News Time - Deployment Guide

## Project Architecture

```
📁 Your Project
├── 📁 frontend (React + Vite)
│   └── Deployed to: yourdomain.com
└── 📁 backend (Node.js + Express + MySQL)
    └── Deployed to: api.yourdomain.com
```

## Step 1: GitHub Setup

### 1.1 Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/24x7-news-time.git
git push -u origin main
```

---

## Step 2: Hostinger MySQL Database Setup

### 2.1 Create Database
1. Log in to **Hostinger hPanel**
2. Go to **Databases → MySQL Databases**
3. Create a new database:
   - Database Name: `news_portal` (or your choice)
   - Username: `news_admin` (or your choice)
   - Password: Generate a strong password
4. **Save these credentials!**

### 2.2 Initialize Database Tables
1. Go to **phpMyAdmin** (click "Manage" next to your database)
2. Click on your database name
3. Go to **SQL** tab
4. Copy and paste the contents of `backend/config/init-database.sql`
5. Click **Go** to execute

---

## Step 3: Backend Deployment (Node.js App on Hostinger)

### 3.1 Create Node.js Application
1. In hPanel, go to **Advanced → Node.js**
2. Click **Create new application**
3. Configure:
   - **Node.js version**: 18.x or 20.x
   - **Application root**: `/domains/api.yourdomain.com/public_html` (see 3.2)
   - **Application URL**: `api.yourdomain.com`
   - **Application startup file**: `server.js`

### 3.2 Create Subdomain for API
1. Go to **Domains → Subdomains**
2. Create subdomain: `api.yourdomain.com`
3. Point it to the Node.js application folder

### 3.3 Upload Backend Files
1. Go to **Files → File Manager**
2. Navigate to `/domains/api.yourdomain.com/public_html/`
3. Upload the entire `backend/` folder contents:
   - `server.js`
   - `package.json`
   - `config/` folder
   - `routes/` folder
   - `middleware/` folder
4. **Create `.env` file** in the root (copy from `.env.example` and fill in):

```env
# Server
PORT=3001
NODE_ENV=production

# Database (from Step 2)
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_database_username
DB_PASSWORD=your_database_password
DB_NAME=your_database_name

# Admin Password - Generate hash first (see Step 3.4)
ADMIN_PASSWORD_HASH=$2a$10$your_hash_here

# JWT Secret - Generate a random string
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# Frontend URL
FRONTEND_URL=https://yourdomain.com
```

### 3.4 Generate Admin Password Hash
Run this locally or use an online bcrypt generator:
```bash
node -e "console.log(require('bcryptjs').hashSync('YOUR_ADMIN_PASSWORD', 10))"
```
Copy the output to `ADMIN_PASSWORD_HASH` in your `.env`

### 3.5 Install Dependencies & Start
1. In hPanel Node.js section, click on your application
2. Run: `npm install`
3. Click **Restart** to start the application

### 3.6 Test API
Visit: `https://api.yourdomain.com/api/health`
You should see: `{"status":"ok","database":"connected"}`

---

## Step 4: Frontend Deployment (Static Site)

### 4.1 Build Frontend
```bash
# In project root
npm run build
```
This creates the `dist/` folder.

### 4.2 Configure Environment
Create `.env` in project root before building:
```env
VITE_API_URL=https://api.yourdomain.com
```

Then rebuild: `npm run build`

### 4.3 Upload to Hostinger
1. Go to **Files → File Manager**
2. Navigate to `/domains/yourdomain.com/public_html/`
3. **Delete** existing files (backup if needed)
4. Upload **all contents** of `dist/` folder
5. Create `.htaccess` file with:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [L]
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>

# Gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/css application/javascript
</IfModule>
```

---

## Step 5: SSL Configuration

1. In hPanel, go to **Security → SSL**
2. Install **Let's Encrypt** for both:
   - `yourdomain.com`
   - `api.yourdomain.com`
3. Enable **Force HTTPS**

---

## Step 6: Test Everything

### Frontend Tests
- [ ] Homepage loads: `https://yourdomain.com`
- [ ] Dark mode toggle works
- [ ] News categories navigate correctly
- [ ] Search functionality works
- [ ] Live stream page loads

### Admin Panel Tests
- [ ] Admin login: `https://yourdomain.com/admin/login`
- [ ] Dashboard shows stats
- [ ] Can add/edit/delete posts
- [ ] Can manage categories
- [ ] YouTube videos management works
- [ ] Live stream settings work

### API Tests
- [ ] Health check: `https://api.yourdomain.com/api/health`
- [ ] Categories API: `https://api.yourdomain.com/api/categories`
- [ ] Posts API: `https://api.yourdomain.com/api/posts`

---

## File Structure Reference

```
📁 Hostinger File Manager
├── 📁 domains
│   ├── 📁 yourdomain.com
│   │   └── 📁 public_html (Frontend files)
│   │       ├── index.html
│   │       ├── .htaccess
│   │       └── assets/
│   │
│   └── 📁 api.yourdomain.com
│       └── 📁 public_html (Backend files)
│           ├── server.js
│           ├── package.json
│           ├── .env
│           ├── 📁 config/
│           ├── 📁 routes/
│           └── 📁 middleware/
```

---

## Environment Variables Summary

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment | `production` |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_USER` | MySQL username | `news_admin` |
| `DB_PASSWORD` | MySQL password | `your_password` |
| `DB_NAME` | Database name | `news_portal` |
| `ADMIN_PASSWORD_HASH` | Bcrypt hash | `$2a$10$...` |
| `JWT_SECRET` | JWT signing key | `random-32-char-string` |
| `FRONTEND_URL` | Frontend URL | `https://yourdomain.com` |

### Frontend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://api.yourdomain.com` |

---

## Troubleshooting

### "Cannot connect to database"
- Verify database credentials in `.env`
- Check if database exists in phpMyAdmin
- Ensure Node.js app can access localhost MySQL

### "CORS Error"
- Verify `FRONTEND_URL` in backend `.env`
- Check that both domains have SSL enabled

### "404 on page refresh"
- Ensure `.htaccess` file exists in frontend `public_html`
- Verify `mod_rewrite` is enabled

### "Admin login fails"
- Verify `ADMIN_PASSWORD_HASH` is correct
- Ensure `JWT_SECRET` is set
- Check browser console for error messages

### "API not responding"
- Check Node.js app status in hPanel
- View Node.js logs for errors
- Verify the startup file is `server.js`

---

## Daily News Management Workflow

1. **Login**: Go to `https://yourdomain.com/admin/login`
2. **Add News**: Dashboard → Add New Post → Fill form → Publish
3. **Add YouTube Videos**: YouTube Videos → Add Video → Paste URL
4. **Go Live**: Live Stream → Enter YouTube Live URL → Click "Go Live"
5. **End Live**: Click "End Live" when stream ends

---

## Support

For issues with deployment:
- Hostinger Support: https://www.hostinger.com/support
- Check server logs in Node.js panel
- Review browser console for frontend errors

---

© 2026 24x7 News Time Pvt Ltd
