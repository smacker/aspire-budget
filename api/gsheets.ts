import { formatDate } from '../helpers/date';
import GoogleAuthLocalStorage from './gauthlocalstorage';
import { Spreadsheet, Stats, Category, Balance, Transaction } from '../types';
import { AuthData, IGAuth } from './types';

const driveBaseURL = 'https://www.googleapis.com/drive/v3';
const sheetsBaseURL = 'https://sheets.googleapis.com/v4/spreadsheets';
const scopes = [
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/spreadsheets',
];

export default class GSheetsAps {
  private auth: IGAuth;

  private authData?: AuthData;
  private spreadsheetId?: string;

  constructor(clientId: string) {
    this.auth = new GoogleAuthLocalStorage(clientId, scopes);
  }

  public async init() {
    this.authData = await this.auth.load();

    const { expiryTime, refreshToken } = this.authData;
    if (new Date().getTime() >= expiryTime) {
      this.authData = await this.auth.refresh(refreshToken);
    }

    return this.authData;
  }

  public async login(): Promise<AuthData> {
    this.authData = await this.auth.login();
    return this.authData;
  }

  public async logout() {
    await this.auth.logout();
  }

  public setSpreadsheetId(id: string) {
    // maybe run validation here?
    this.spreadsheetId = id;
  }

  public async fetchSpreadSheets(): Promise<Spreadsheet[]> {
    const resp = await this.fetch(
      `${driveBaseURL}/files?q=mimeType='application/vnd.google-apps.spreadsheet'`
    );
    const data = await resp.json();
    return data.files;
  }

  public async verifySpreadSheet(spreadsheetId: string) {
    const resp = await this.fetch(
      `${sheetsBaseURL}/${spreadsheetId}/values/BackendData!2:2`
    );

    const data = await resp.json();
    if (!data || !data.values || !data.values.length) {
      return false;
    }

    const verison = data.values[0][data.values[0].length - 1];
    return verison === '3.2.0' || verison === '3.3.0';
  }

  public async fetchMainStats(): Promise<Stats> {
    const resp = await this.fetch(
      `${sheetsBaseURL}/${this.spreadsheetId}/values/Dashboard!H2:O2?valueRenderOption=UNFORMATTED_VALUE`
    );

    const data = await resp.json();
    const values = (data && data.values && data.values[0]) || {};

    return {
      toBudget: values[0],
      spent: values[1],
      budgeted: values[3],
      pending: values[7],
    };
  }

  public async fetchCategoriesBalance(): Promise<Category[]> {
    const resp = await this.fetch(
      `${sheetsBaseURL}/${this.spreadsheetId}/values/Dashboard!F6:O80?valueRenderOption=UNFORMATTED_VALUE`
    );

    const data = await resp.json();
    if (!data || !data.values) {
      return [];
    }

    const groupIndexes = [];
    const rows = data.values.map((row, i) => {
      const available = parseFloat(row[3]) || 0;
      const activity = parseFloat(row[6]) || 0;
      const budgeted = parseFloat(row[9]) || 0;
      const isGroup = row[0] === '✦';
      const isCreditCard = row[0] === '◘';
      if (isGroup) {
        groupIndexes.push(i);
      }

      return {
        id: '' + i,
        name: row[2],
        // raw values
        available,
        activity,
        budgeted,
        // how much was budgeted including carried forward
        budgetedTotal: available - activity,
        // types of rows
        isGroup,
        isCreditCard,
      };
    });

    // set a type credit card to a group if it contains only credit cards
    // FIXME: check what is going on in mixed groups
    for (let i = 0; i < groupIndexes.length; i++) {
      const groupIdx = groupIndexes[i];
      const nextGroupIdx =
        i + 1 < groupIndexes.length ? groupIndexes[i + 1] : undefined;
      if (rows.slice(groupIdx + 1, nextGroupIdx).every((r) => r.isCreditCard)) {
        rows[groupIdx].isCreditCard = true;
      }
    }

    return rows;
  }

  public async fetchBalances(): Promise<Balance[]> {
    const resp = await this.fetch(
      `${sheetsBaseURL}/${this.spreadsheetId}/values/Dashboard!B8:C`
    );

    const data = await resp.json();
    if (!data || !data.values) {
      return [];
    }

    return data.values.reduce((acc, row, i) => {
      if (i % 2 == 0) {
        acc.push({
          id: '' + i,
          name: row[0],
          amount: row[1],
        });
      } else {
        acc[acc.length - 1].lastUpdateOn = row[0];
      }

      return acc;
    }, []);
  }

  public async fetchTransactionAccounts(): Promise<string[]> {
    const resp = await this.fetch(
      `${sheetsBaseURL}/${this.spreadsheetId}/values/BackendData!M2:M`
    );

    const data = await resp.json();
    if (!data || !data.values) {
      return [];
    }

    return data.values.flat();
  }

  public async fetchAddTransaction(data: Transaction) {
    const body = {
      majorDimension: 'ROWS',
      values: [
        [
          formatDate(data.date),
          !data.inflow ? data.amount : '',
          data.inflow ? data.amount : '',
          data.category,
          data.account,
          data.memo,
          '✅',
        ],
      ],
    };

    const resp = await this.fetch(
      `${sheetsBaseURL}/${this.spreadsheetId}/values/Transactions!B:H:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      }
    );

    return resp.status === 200;
  }

  private async fetch(url: string, params = {}) {
    if (!this.authData) {
      throw new Error('no token');
    }

    const { expiryTime, refreshToken } = this.authData;
    if (new Date().getTime() >= expiryTime) {
      this.authData = await this.auth.refresh(refreshToken);
    }

    const { accessToken } = this.authData;

    const resp = await fetch(url, {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${accessToken}`,
      },
      ...params,
    });

    console.debug(
      `fetch ${url}\nparams: ${JSON.stringify(params)}\nresp:\n${JSON.stringify(
        {
          status: resp.status,
          headers: resp.headers,
        }
      )}`
    );

    if (resp.status !== 200) {
      throw {
        type: 'status',
        status: resp.status,
        data: await resp.json(),
      };
    }

    return resp;
  }
}
