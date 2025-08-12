# ClipSync Project Structure Guide

## 📁 Complete Project Structure

```
ClipSync/
├── 📱 frontend/                    # React Client Application
│   ├── public/                     # Static files (index.html, icons)
│   ├── src/                        
│   │   ├── components/             # Reusable UI components
│   │   │   ├── VideoPlayer/        # HLS video player
│   │   │   ├── VideoUpload/        # Upload form
│   │   │   └── Auth/               # Login/signup forms
│   │   ├── pages/                  # Main pages
│   │   │   ├── Home.jsx           # Homepage with video feed
│   │   │   ├── Upload.jsx         # Video upload page
│   │   │   └── Profile.jsx        # User profile
│   │   ├── services/              # API calls
│   │   │   ├── authAPI.js         # Auth-related API calls
│   │   │   └── videoAPI.js        # Video-related API calls
│   │   ├── utils/                 # Helper functions
│   │   └── App.jsx                # Main React component
│   ├── package.json               # Frontend dependencies
│   └── Dockerfile                 # Container for deployment
│
├── 🔐 auth-service/               # Authentication Microservice
│   ├── src/
│   │   ├── controllers/           # Handle requests
│   │   │   └── authController.js  # Login, signup, verify
│   │   ├── middleware/            # Security, validation
│   │   │   └── authMiddleware.js  # JWT verification
│   │   ├── models/                # Database models
│   │   │   └── User.js            # User schema
│   │   ├── routes/                # API endpoints
│   │   │   └── authRoutes.js      # /login, /signup, /verify
│   │   ├── utils/                 # Helper functions
│   │   │   └── jwtUtils.js        # JWT token functions
│   │   └── app.js                 # Express server setup
│   ├── package.json               # Auth service dependencies
│   └── Dockerfile                 # Container for deployment
│
├── 📹 video-upload-api/           # Video Upload Microservice
│   ├── src/
│   │   ├── controllers/
│   │   │   └── uploadController.js # Handle video uploads
│   │   ├── middleware/
│   │   │   ├── multer.js          # File upload handling
│   │   │   └── validation.js      # File validation
│   │   ├── models/
│   │   │   └── Video.js           # Video metadata schema
│   │   ├── routes/
│   │   │   └── uploadRoutes.js    # /upload endpoints
│   │   ├── services/
│   │   │   ├── azureBlobService.js # Azure Blob Storage
│   │   │   └── kafkaService.js    # Send to processing queue
│   │   └── app.js
│   ├── package.json
│   └── Dockerfile
│
├── ⚙️ video-processor/            # Video Processing Worker
│   ├── src/
│   │   ├── workers/
│   │   │   └── videoWorker.js     # Processes video files
│   │   ├── services/
│   │   │   ├── ffmpegService.js   # Video transcoding
│   │   │   ├── hlsService.js      # HLS conversion
│   │   │   └── azureMediaService.js # Azure Media Services
│   │   ├── utils/
│   │   │   └── fileUtils.js       # File operations
│   │   └── app.js                 # Worker process
│   ├── package.json
│   └── Dockerfile
│
├── 👥 user-service/               # User Management Microservice
│   ├── src/
│   │   ├── controllers/
│   │   │   └── userController.js  # Profile, settings
│   │   ├── models/
│   │   │   └── UserProfile.js     # Extended user data
│   │   ├── routes/
│   │   │   └── userRoutes.js      # /profile, /settings
│   │   └── app.js
│   ├── package.json
│   └── Dockerfile
│
├── 🔔 notification-service/       # Notification Microservice
│   ├── src/
│   │   ├── controllers/
│   │   │   └── notificationController.js
│   │   ├── services/
│   │   │   ├── emailService.js    # Email notifications
│   │   │   └── pushService.js     # Push notifications
│   │   └── app.js
│   ├── package.json
│   └── Dockerfile
│
├── 📚 shared/                     # Shared Code/Libraries
│   ├── utils/                     # Common utilities
│   │   ├── logger.js              # Logging across services
│   │   ├── config.js              # Environment variables
│   │   └── database.js            # DB connection
│   ├── middleware/                # Shared middleware
│   │   └── corsMiddleware.js      # CORS settings
│   └── types/                     # TypeScript types (if using TS)
│
├── 🏗️ infrastructure/             # Azure Infrastructure as Code
│   ├── bicep/                     # Azure Bicep templates
│   │   ├── main.bicep             # Main infrastructure
│   │   ├── storage.bicep          # Blob storage
│   │   ├── database.bicep         # PostgreSQL
│   │   └── app-services.bicep     # App Services
│   ├── arm/                       # ARM templates (alternative)
│   └── scripts/                   # Deployment scripts
│       └── deploy.sh              # Deploy to Azure
│
├── 🔄 .github/workflows/          # GitHub Actions CI/CD
│   ├── frontend-deploy.yml        # Deploy React app
│   ├── backend-deploy.yml         # Deploy all microservices
│   ├── infrastructure-deploy.yml  # Deploy Azure resources
│   └── test.yml                   # Run tests
│
├── 🐳 Docker & Config Files
│   ├── docker-compose.yml         # Local development setup
│   ├── docker-compose.prod.yml    # Production setup
│   ├── .env.example              # Environment variables template
│   ├── .gitignore                # Git ignore rules
│   └── nginx.conf                # Reverse proxy config
│
└── 📋 Documentation
    ├── README.md                 # Project overview
    ├── API_DOCS.md              # API documentation
    ├── DEPLOYMENT.md            # How to deploy
    └── CONTRIBUTING.md          # How to contribute
```

## 🎯 Why This Structure?

### **Separation of Concerns**
- Each service has one job (auth, upload, processing)
- Easy to find and fix issues
- Teams can work on different services

### **Scalability**
- Scale services independently
- Deploy updates to one service without affecting others

### **Maintainability**
- Clear organization makes code easy to understand
- New developers can quickly find what they need

### **Azure Integration**
- Each service can be deployed as separate Azure App Service
- Infrastructure code manages Azure resources
- CI/CD pipelines handle automatic deployments

## 🚀 What Each Service Does:

1. **Frontend**: User interface (React app)
2. **Auth Service**: Handles login, signup, JWT tokens
3. **Video Upload API**: Receives video files, stores in Azure Blob
4. **Video Processor**: Transcodes videos, creates HLS streams
5. **User Service**: Manages user profiles, settings
6. **Notification Service**: Sends emails, push notifications

Would you like me to create this structure in your ClipSync project?
