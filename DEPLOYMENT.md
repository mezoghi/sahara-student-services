# Deployment Guide

## Quick Deploy to Production

### Prerequisites
- GitHub account
- Vercel account (for frontend)
- Railway/Render account (for backend)
- PostgreSQL database
- AWS S3 bucket (optional, for file uploads)

## Frontend Deployment (Vercel)

### Option 1: Deploy via Vercel Dashboard

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/sahara-student-services.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Set root directory to `frontend`
   - Add environment variable:
     - `NEXT_PUBLIC_API_URL`: Your backend API URL

3. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your frontend

### Option 2: Deploy via Vercel CLI

```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

## Backend Deployment (Railway)

### Option 1: Deploy via Railway Dashboard

1. **Create new project on Railway**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Configure the service**
   - Set root directory to `backend`
   - Add a PostgreSQL database
   - Set environment variables:
     ```
     DATABASE_URL=(auto-filled by Railway)
     JWT_SECRET=your-super-secret-key
     JWT_EXPIRES_IN=7d
     AWS_REGION=us-east-1
     AWS_ACCESS_KEY_ID=your-key
     AWS_SECRET_ACCESS_KEY=your-secret
     S3_BUCKET_NAME=your-bucket
     SMTP_HOST=smtp.gmail.com
     SMTP_PORT=587
     SMTP_USER=your-email
     SMTP_PASSWORD=your-password
     EMAIL_FROM=noreply@yourdomain.com
     PORT=5000
     NODE_ENV=production
     FRONTEND_URL=https://your-frontend.vercel.app
     ```

3. **Deploy**
   - Railway will automatically build and deploy
   - Run migrations: `npx prisma migrate deploy`
   - Seed database: `npm run seed`

### Option 2: Deploy to Render

1. **Create new Web Service**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure**
   - Name: sahara-backend
   - Root Directory: `backend`
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npm start`
   - Add PostgreSQL database
   - Add environment variables (same as Railway)

3. **Deploy**
   - Click "Create Web Service"
   - Run migrations from Render shell

## Database Setup

### Railway PostgreSQL

Railway automatically provisions a PostgreSQL database. After deployment:

```bash
# Connect to your Railway project
railway login
railway link

# Run migrations
railway run npx prisma migrate deploy

# Seed database
railway run npm run seed
```

### Render PostgreSQL

1. Create a PostgreSQL database in Render
2. Copy the Internal Database URL
3. Add it as `DATABASE_URL` environment variable
4. Run migrations from the Render shell

## AWS S3 Setup (File Uploads)

1. **Create S3 Bucket**
   - Go to AWS Console → S3
   - Create new bucket (e.g., `sahara-student-files`)
   - Enable versioning
   - Set appropriate CORS policy:
     ```json
     [
       {
         "AllowedHeaders": ["*"],
         "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
         "AllowedOrigins": ["*"],
         "ExposeHeaders": []
       }
     ]
     ```

2. **Create IAM User**
   - Go to IAM → Users → Add User
   - Enable programmatic access
   - Attach policy: `AmazonS3FullAccess`
   - Save Access Key ID and Secret Access Key

3. **Update Environment Variables**
   - Add AWS credentials to your backend deployment

## Email Setup (Nodemailer)

### Using Gmail

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Google Account → Security → 2-Step Verification → App passwords
   - Select "Mail" and your device
   - Copy the generated password

3. Update environment variables:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   ```

### Using SendGrid (Recommended for Production)

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Create an API key
3. Update environment variables:
   ```
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASSWORD=your-sendgrid-api-key
   ```

## Post-Deployment Checklist

- [ ] Frontend deployed and accessible
- [ ] Backend deployed and accessible
- [ ] Database migrations run successfully
- [ ] Database seeded with initial data
- [ ] Environment variables configured
- [ ] S3 bucket created and configured (if using file uploads)
- [ ] Email service configured and tested
- [ ] CORS configured correctly
- [ ] SSL/HTTPS enabled
- [ ] Custom domain configured (optional)
- [ ] Monitoring and logging set up

## Testing the Deployment

1. **Test Frontend**
   - Visit your Vercel URL
   - Navigate through public pages
   - Test registration and login

2. **Test Backend**
   - Visit `https://your-backend-url/health`
   - Check API documentation at `/api-docs`
   - Test authentication endpoints

3. **Test Full Flow**
   - Register a new user
   - Browse courses
   - Create an application
   - Upload documents
   - Submit application
   - Login as admin and review

## Monitoring

### Vercel
- Analytics available in Vercel dashboard
- Real-time logs in deployment details

### Railway
- Metrics available in Railway dashboard
- View logs in real-time
- Set up alerts for errors

### Render
- Metrics and logs in Render dashboard
- Configure health checks
- Set up notifications

## Troubleshooting

### Frontend Issues
- Check Vercel deployment logs
- Verify environment variables
- Ensure API URL is correct

### Backend Issues
- Check Railway/Render logs
- Verify database connection
- Check environment variables
- Ensure migrations ran successfully

### Database Issues
- Verify DATABASE_URL is correct
- Check database is running
- Run migrations manually if needed

## Scaling

### Frontend (Vercel)
- Automatic scaling
- Edge network distribution
- No configuration needed

### Backend (Railway/Render)
- Upgrade plan for more resources
- Enable autoscaling (Railway Pro)
- Add more instances (Render)

### Database
- Upgrade PostgreSQL plan
- Enable connection pooling
- Consider read replicas for high traffic

## Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT secret
- [ ] Enable HTTPS only
- [ ] Configure CORS properly
- [ ] Set secure cookie flags
- [ ] Enable rate limiting
- [ ] Regular security updates
- [ ] Monitor for suspicious activity

## Backup Strategy

### Database Backups
- Railway: Automatic daily backups
- Render: Configure backup schedule
- Manual backups: `pg_dump`

### File Backups
- S3: Enable versioning
- Configure lifecycle policies
- Regular backup verification

## Support

For deployment issues:
- Check documentation
- Review deployment logs
- Contact support@saharastudentservices.com
