const driveBaseURL = 'https://www.googleapis.com/drive/v3';
const sheetsBaseURL = 'https://sheets.googleapis.com/v4/spreadsheets';

function _fetch(token, url, params = {}) {
  return fetch(url, {
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      Authorization: `Bearer ${token}`,
    },
    ...params,
  });
}

export async function fetchSpreadSheets(token) {
  const resp = await _fetch(
    token,
    `${driveBaseURL}/files?q=mimeType='application/vnd.google-apps.spreadsheet'`
  );
  const data = await resp.json();
  return data.files;
}

export async function verifySpreadSheet(token, spreadsheetId) {
  const resp = await _fetch(
    token,
    `${sheetsBaseURL}/${spreadsheetId}/values/BackendData!2:2`
  );

  const data = await resp.json();
  if (resp.status !== 200) {
    throw {
      type: 'status',
      status: resp.status,
      data,
    };
  }

  if (!data || !data.values || !data.values.length) {
    return false;
  }

  return data.values[0][data.values[0].length - 1] === '3.2.0';
}

export async function fetchCategoriesBalance(token, spreadsheetId) {
  const resp = await _fetch(
    token,
    `${sheetsBaseURL}/${spreadsheetId}/values/Dashboard!F6:O80`
  );

  const data = await resp.json();
  if (resp.status !== 200) {
    throw {
      type: 'status',
      status: resp.status,
      data,
    };
  }

  if (!data || !data.values) {
    return [];
  }

  return data.values.map((row, i) => {
    return {
      id: '' + i,
      name: row[2],
      available: row[3],
      activity: row[6],
      budgeted: row[9],
      group: row[0] === '✦',
    };
  });
}

export async function fetchBalances(token, spreadsheetId) {
  const resp = await _fetch(
    token,
    `${sheetsBaseURL}/${spreadsheetId}/values/Dashboard!B8:C`
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

export async function fetchTransactionAccounts(token, spreadsheetId) {
  const resp = await _fetch(
    token,
    `${sheetsBaseURL}/${spreadsheetId}/values/BackendData!M2:M`
  );

  const data = await resp.json();
  if (resp.status !== 200) {
    throw {
      type: 'status',
      status: resp.status,
      data,
    };
  }

  if (!data || !data.values) {
    return [];
  }

  return data.values.flat();
}

export async function addTransaction(token, spreadsheetId, data) {
  const body = {
    //"range": string,
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

  const resp = await _fetch(
    token,
    `${sheetsBaseURL}/${spreadsheetId}/values/Transactions!B:H:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      body: JSON.stringify(body),
    }
  );

  // FIXME add some validation here
  return true;
}

function formatDate(d) {
  const yyyy = d.getFullYear();
  const mm = padZero(d.getMonth() + 1);
  const dd = padZero(d.getDate());
  return `${dd}/${mm}/${yyyy}`;
}

function padZero(v) {
  if (('' + v).length < 2) {
    return '0' + v;
  }

  return v;
}
