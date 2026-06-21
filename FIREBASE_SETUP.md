# Firebase Setup Guide for Altonsworld Portfolio

## 🚀 Quick Setup Steps

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name your project: `altonsworld-portfolio`
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Firebase Services
In your Firebase project, enable:

#### Authentication
- Go to "Authentication" → "Get started"
- Enable "Email/Password" sign-in method
- Save settings

#### Firestore Database
- Go to "Firestore Database" → "Create database"
- Choose "Start in test mode" (for now)
- Select a location (choose closest to your users)
- Create database

#### Storage
- Go to "Storage" → "Get started"
- Choose "Start in test mode" (for now)
- Select a location
- Enable storage

### 3. Get Firebase Configuration
1. Go to Project Settings (⚙️ icon)
2. Under "Your apps", click "Web"
3. Copy the Firebase configuration object
4. It should look like this:
```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### 4. Create Environment Variables
Create a file named `.env.local` in your project root:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 5. Restart Your Development Server
```bash
npm run dev
```

### 6. Test the Connection
- Visit: http://localhost:3000/work
- Check browser console for any Firebase errors
- Try uploading a photo via admin panel

## 🔧 Troubleshooting

### Common Issues:

#### "Firebase is not properly configured"
- Check that all environment variables are set
- Ensure `.env.local` file exists
- Restart the development server

#### "No photo projects found"
- Check Firestore database has data
- Verify category field is "photo" (not "photography")
- Check browser console for debug info

#### "Cannot read properties of undefined"
- Firebase services not initialized
- Check environment variables
- Ensure Firebase project is created

### Debug Steps:
1. Open browser console (F12)
2. Look for Firebase-related errors
3. Check Network tab for failed requests
4. Verify environment variables in `.env.local`

## 📱 Firebase Rules (Security)

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🎯 Next Steps

Once Firebase is working:
1. Upload photos via admin panel
2. Check they appear in Work page
3. Verify featured photos on homepage
4. Test category filtering

Need help? Check the browser console for specific error messages!
