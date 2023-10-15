# Aspire budgeting mobile

A simple mobile app to work with [aspire budgeting spreadsheet](https://aspirebudget.com/).

### Download

#### Android

Standalone APK: [Download from GitHub releases](https://github.com/smacker/aspire-budget/releases)

#### iOS

Coming soon.

### Screenshots

<img src="https://raw.githubusercontent.com/smacker/aspire-budget/master/.github/images/Dashboard.png" alt="Dashboard" width="250" /> <img src="https://raw.githubusercontent.com/smacker/aspire-budget/master/.github/images/Add-transaction.png" alt="Add transaction" width="250" /> <img src="https://raw.githubusercontent.com/smacker/aspire-budget/master/.github/images/Balances.png" alt="Balances" width="250" />

### Development

1. Obtain Google API keys for [Auth](https://docs.expo.dev/guides/authentication/#google) and [Sheets API](https://developers.google.com/sheets/api/guides/authorizing).
2. Install dependencies: `yarn`
3. Create `.env` file with the following content to access Sheets API:

```
EXPO_PUBLIC_ANDROID_CLIENT_ID=<your client id>
```

4. Create and install the development build `eas build --profile development --platform android`
5. Start development server: `yarn start`
6. Open the development build app and connect to the server
