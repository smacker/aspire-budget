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
    `${sheetsBaseURL}/${spreadsheetId}/values/Dashboard!F6:O80?valueRenderOption=UNFORMATTED_VALUE`
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
