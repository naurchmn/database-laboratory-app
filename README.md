# Database Laboratory App

**Database Laboratory App** adalah aplikasi mobile pembelajaran sekaligus pendamping praktikum Basis Data yang menyediakan konten berupa materi/pertemuan (lectures), kuis (quiz), serta informasi dan pengumuman (bulletin). Aplikasi ini juga dilengkapi dengan halaman tambahan (More) yang mencakup fitur profil dan pengaturan.

Aplikasi ini dikembangkan sebagai aplikasi mobile berbasis Expo + React Native dengan menggunakan Expo Router untuk mendukung proses pembelajaran dan praktikum Basis Data agar lebih terstruktur, interaktif, dan mudah diakses oleh pengguna.

Yang sudah tersedia di repo ini:
- Unit/component test dengan **Jest + React Native Testing Library**
- End-to-end (E2E) test dengan **Detox** untuk **iOS Simulator** dan **Android Emulator**

Identitas aplikasi (dari konfigurasi Expo):
- Nama/Slug: `DatabaseLaboratory`
- iOS bundle id: `com.basdat.databaselaboratory`
- Android package: `com.basdat.databaselaboratory`

## Gambaran struktur repo

- `app/`: routing & UI pages (Expo Router)
- `src/`: logic aplikasi, komponen, services, hooks, assets
- `src/__tests__/`: unit/component tests (`*.test.ts(x)`)
- `e2e/`: Detox E2E tests (`*.e2e.ts`) + konfigurasi Jest runner
- `.detoxrc.js`: konfigurasi Detox (device/app)
- `android/` dan `ios/`: project native (dibutuhkan untuk Detox + native build)
- `patches/`: patch dari `patch-package` yang jalan otomatis saat `postinstall`

## Prasyarat

Umum:
- Node.js + npm
- Watchman (direkomendasikan di macOS)

iOS (khusus macOS):
- Xcode + Xcode Command Line Tools
- iOS Simulator terpasang (konfigurasi Detox pakai **iPhone 15**)

Android:
- Android Studio + Android SDK
- AVD bernama **Pixel_6** (konfigurasi Detox pakai `avdName: Pixel_6`)
- Pastikan `ANDROID_SDK_ROOT` terset (Detox butuh ini untuk menemukan `adb`)

## Install

```bash
npm install
```

Catatan: `postinstall` akan menjalankan `patch-package` otomatis.

## Menjalankan aplikasi (dev)

```bash
npm run start
```

### Menjalankan lewat Expo Go (di HP)

1) Install aplikasi **Expo Go** di HP (Android/iOS).

2) Jalankan Metro bundler (QR code akan muncul di terminal/browser):

```bash
npm run start
```

3) Buka Expo Go, lalu scan QR code tersebut.

Catatan:
- Pastikan laptop dan HP ada di jaringan Wi‑Fi yang sama.
- Bisa juga jalanin di emulator/simulator: pastikan iOS Simulator atau Android Emulator sudah nyala, lalu di terminal Metro tekan `i` (iOS) atau `a` (Android).

Atau run native dev build:

```bash
npm run ios
npm run android
```

## Unit / component tests (Jest)

Test ada di `src/__tests__/` dan match `**/*.test.ts(x)`.

Jalankan sekali:

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

Coverage:

```bash
npm run test:coverage
```

## E2E tests (Detox)

Detox memakai konfigurasi `.detoxrc.js` dan menjalankan Jest melalui `e2e/jest.config.js`.

Catatan penting:
- Android E2E dijalankan menggunakan APK **release** (`android.emu.release`) supaya lebih stabil.
- Listener yang hidup lama (mis. Firestore) bisa bikin app terlihat “busy”; beberapa test E2E bisa menonaktifkan synchronization setelah login.

### iOS E2E (Simulator)

Satu kali / kalau native config berubah:

```bash
npm run e2e:ios:prebuild
```

Build app untuk testing:

```bash
npm run e2e:ios:build
```

Jalankan semua iOS E2E tests:

```bash
npm run e2e:ios:test
```

Atau semua langkah sekaligus:

```bash
npm run e2e:ios
```

Jalankan 1 suite saja:

```bash
npx detox test -c ios.sim.debug e2e/smoke.e2e.ts
```

### Non-functional tests (iOS)

Non-functional E2E tests ada di folder `e2e/nonfunctional/`:
- `accessibility.e2e.ts`
- `performance.e2e.ts`
- `reliability.e2e.ts`

Jalankan ketiganya sekaligus (iOS saja):

```bash
npx detox test -c ios.sim.debug e2e/nonfunctional
```

Atau jalankan satu per satu:

```bash
npx detox test -c ios.sim.debug e2e/nonfunctional/accessibility.e2e.ts
npx detox test -c ios.sim.debug e2e/nonfunctional/performance.e2e.ts
npx detox test -c ios.sim.debug e2e/nonfunctional/reliability.e2e.ts
```

### Non-functional tests (Android)

Non-functional E2E tests ada di folder `e2e/nonfunctional/` (sama seperti iOS).

Jalankan ketiganya sekaligus (Android saja):

```bash
npx detox test -c android.emu.release e2e/nonfunctional
```

Atau jalankan satu per satu:

```bash
npx detox test -c android.emu.release e2e/nonfunctional/accessibility.e2e.ts
npx detox test -c android.emu.release e2e/nonfunctional/performance.e2e.ts
npx detox test -c android.emu.release e2e/nonfunctional/reliability.e2e.ts
```

### Android E2E (Emulator)

Pastikan env SDK sudah benar (default macOS):

```bash
export ANDROID_SDK_ROOT="$HOME/Library/Android/sdk"
export PATH="$ANDROID_SDK_ROOT/platform-tools:$PATH"
```

Satu kali / kalau native config berubah:

```bash
npm run e2e:android:prebuild
```

Build release APK + androidTest APK:

```bash
npm run e2e:android:build
```

Jalankan semua Android E2E tests:

```bash
npm run e2e:android:test
```

Atau semua langkah sekaligus:

```bash
npm run e2e:android
```

Jalankan 1 suite saja:

```bash
npx detox test -c android.emu.release e2e/smoke.e2e.ts
```

## Build pakai EAS (Expo Application Services)

Repo ini sudah punya konfigurasi EAS di `eas.json` (profiles: `development`, `preview`, `apk`, `production`). Umumnya EAS dipakai untuk menghasilkan build yang bisa di-install/didistribusikan, sedangkan Detox dipakai untuk E2E test lokal di simulator/emulator.

### 1) Persiapan EAS

Install EAS CLI:

```bash
npm install -g eas-cli
```

Login (pakai akun Expo):

```bash
eas login
```

### 2) Build Android

Build **APK** (lebih gampang untuk install manual):

```bash
eas build --platform android --profile apk
```

Build **AAB** untuk rilis (Play Store) + auto increment versi (sesuai profile `production`):

```bash
eas build --platform android --profile production
```

## Lint

```bash
npm run lint
```

## Troubleshooting

- Detox Android error tidak menemukan SDK: set `ANDROID_SDK_ROOT`.
- Nama AVD berbeda: buat/rename emulator menjadi `Pixel_6` atau ubah `.detoxrc.js`.
- Ada warning Watchman recrawl: jalankan command yang disarankan di terminal untuk reset watch.

