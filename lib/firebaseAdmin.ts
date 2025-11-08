import admin from 'firebase-admin'

const globalForAdmin = global as unknown as { adminApp?: admin.app.App }

if (!globalForAdmin.adminApp) {
  try {
    if (
      !process.env.FIREBASE_PROJECT_ID ||
      !process.env.FIREBASE_CLIENT_EMAIL ||
      !process.env.FIREBASE_PRIVATE_KEY
    ) {
      throw new Error('Missing Firebase environment variables')
    }

    globalForAdmin.adminApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    })

    console.log('✅ Firebase Admin initialized successfully')
  } catch (error) {
    console.error('🔥 Firebase Admin initialization failed:', error)
  }
}

export const adminDb = globalForAdmin.adminApp
  ? globalForAdmin.adminApp.firestore()
  : (() => {
      throw new Error('Firebase Admin is not initialized properly')
    })()
