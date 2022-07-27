# Aspire budgeting mobile

A simple mobile app to work with [aspire budgeting spreadsheet](https://aspirebudget.com/).

### Download

#### Android

Standalone APK: [Download from GitHub releases](https://github.com/smacker/aspire-budget/releases)

Expo Go release channel: https://expo.dev/@smacker/aspire

#### iOS

Coming soon.

### Screenshots

<img src="https://raw.githubusercontent.com/smacker/aspire-budget/master/.github/images/Dashboard.png" alt="Dashboard" width="250" /> <img src="https://raw.githubusercontent.com/smacker/aspire-budget/master/.github/images/Add-transaction.png" alt="Add transaction" width="250" /> <img src="https://raw.githubusercontent.com/smacker/aspire-budget/master/.github/images/Balances.png" alt="Balances" width="250" />

### Development

1. Obtain Google API keys for [Auth](https://docs.expo.dev/guides/authentication/#google) and [Sheets API](https://developers.google.com/sheets/api/guides/authorizing).
2. Install dependencies: `yarn`
3. Create `.env` file with the following content to access Sheets API:
```
EXPO_CLIENT_ID=<your client id>
EXPO_CLIENT_SECRET=<your client secret>
ANDROID_STANDALONE_CLIENT_ID=<your client id>
```
4. Start development server: `yarn start`
5. Use [Expo](https://docs.expo.dev/) client to run it on your mobile.
