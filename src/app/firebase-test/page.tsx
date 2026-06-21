"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function FirebaseTest() {
  const [status, setStatus] = useState<string>("Checking Firebase...");
  const [envVars, setEnvVars] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const testFirebase = async () => {
      try {
        // Check environment variables
        const envCheck = {
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "✅ Set" : "❌ Missing",
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "✅ Set" : "❌ Missing",
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "✅ Set" : "❌ Missing",
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? "✅ Set" : "❌ Missing",
          messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? "✅ Set" : "❌ Missing",
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? "✅ Set" : "❌ Missing",
        };
        
        setEnvVars(envCheck);

        // Test Firebase connection
        if (!db) {
          setStatus("❌ Firebase not initialized");
          setError("Firebase database connection failed");
          return;
        }

        setStatus("🔥 Testing Firestore connection...");
        
        // Try to read from projects collection
        const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        setStatus("✅ Firebase connected successfully!");
        console.log(`Found ${querySnapshot.size} documents in projects collection`);

      } catch (err) {
        setStatus("❌ Firebase connection failed");
        setError(err instanceof Error ? err.message : "Unknown error");
        console.error("Firebase test error:", err);
      }
    };

    testFirebase();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Firebase Connection Test</h1>
        
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Status: {status}</h2>
          
          {error && (
            <div className="bg-red-900/50 border border-red-500 rounded p-4 mb-4">
              <h3 className="text-red-400 font-semibold mb-2">Error Details:</h3>
              <p className="text-red-300">{error}</p>
            </div>
          )}
        </div>

        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2">
            {Object.entries(envVars).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-400">{key}:</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>If environment variables are missing, create `.env.local` file</li>
            <li>Copy `env-example.txt` to `.env.local` and fill in your Firebase credentials</li>
            <li>Restart the development server: `npm run dev`</li>
            <li>Visit this page again to test the connection</li>
          </ol>
          <div className="mt-4">
            <a href="/" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded inline-block">
              Back to Homepage
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
