# README

- [README](#README)
  - [Install dependencies](#Install-dependencies)
    - [Install React Native CLI dependencies](#Install-React-Native-CLI-dependencies)
    - [Install Nodejs dependencies](#Install-Nodejs-dependencies)
    - [Install iOS dependencies](#Install-iOS-dependencies)
  - [Build & Run](#Build--Run)
    - [Run on iOS](#Run-on-iOS)
    - [Run on Android](#Run-on-Android)
  - [Packages](#Packages)
  - [Environment Variables](#Environment-Variables)

## Install dependencies

### Install React Native CLI dependencies

Please follow `React Native CLI Quickstart` instructions on [React Native Getting Started](https://facebook.github.io/react-native/docs/getting-started.html).

### Install Nodejs dependencies

```
yarn
```

### Install iOS dependencies

```
cd packages/app/ios
pod install
cd  ../../..
```

## Build & Run

### Run on iOS

Run on iOS simulator

```
cd packages/app
react-native run-ios
```

Run on iOS device example

```
cd packages/app
react-native run-ios --device Bob’s\ iPhone
```

### Run on Android

Run on Android device

```
cd packages/app
react-native run-android
```

## Packages

- Web & API
  - `./`
- App
  - `./packages/app/`
    - iOS
      - `./packages/app/ios/`
    - Android
      - `./packages/app/android`
- Core
  - `./packages/core/`

## Environment Variables

You need to create following files.

```
.env
```

```
mkdir -p tmp && node env.js > tmp/google_api_credential.json
```

```
packages/app/env.js
```

```
packages/app/ios/GoogleService-Info.plist
```

```
packages/app/android/app/google-services.json
```
