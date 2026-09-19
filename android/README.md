# FitTrack — Android Health Connect Native Integration Guide

This directory contains the native Android bridge artifacts required to wrap the FitTrack React web application in an Android application using an Android WebView or Capacitor.

---

## 1. Prerequisites
- **Android SDK**: Compile SDK 34+ (Android 14) or Min SDK 28 (Android 9.0)
- **Dependency** (in `build.gradle.kts` / `build.gradle`):
  ```kotlin
  dependencies {
      implementation("androidx.health.connect:connect-client:1.1.0-alpha11")
      implementation("androidx.activity:activity-ktx:1.9.0")
      implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.0")
  }
  ```

---

## 2. Setting Up Android WebView with Bridge
In your `MainActivity.kt`:

```kotlin
class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webview)
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true

        // Inject the Health Connect native bridge interface
        webView.addJavascriptInterface(HealthConnectBridge(this), "AndroidHealthConnect")

        // Load your FitTrack bundle or development server
        webView.loadUrl("file:///android_asset/dist/index.html")
    }
}
```

---

## 3. Capacitor Integration Option
If you prefer using Capacitor:
1. Initialize Capacitor: `npx cap init FitTrack com.fittrack.android --web-dir dist`
2. Add Android platform: `npx cap add android`
3. The TypeScript service [`src/services/healthConnectService.ts`](../src/services/healthConnectService.ts) automatically detects `window.AndroidHealthConnect` or can be connected to `@capgo/capacitor-health-connect`.

---

## 4. Health Connect Permissions
FitTrack adheres to the principle of least privilege:
- **Phase 1 (Active)**: `android.permission.health.READ_STEPS`
- **Phase 2 (Upcoming)**: `android.permission.health.READ_EXERCISE`
- **Phase 3 (Upcoming)**: `android.permission.health.READ_SLEEP`
