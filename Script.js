const ACCESS_TOKEN = 'TOKEN_DE_ACCESO_REEMPLAZAR';
const API_VERSION = 'v16.0';

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Meta Marketing API')
    .addItem('Refresh Ads Insights', 'get_ads_insights')
    .addItem('Refresh Adset Insights', 'get_adset_insights')
    .addItem('Refresh Campaign Insights', 'get_campaigns_insights').addSeparator()
    .addItem('Refresh Ads', 'get_ads')
    .addItem('Refresh Adsets', 'get_adsets')
    .addItem('Refresh Campaigns', 'get_campaigns').addSeparator()
    .addItem('Refresh Ad Accounts', 'get_ad_accounts')
    .addToUi();
}

// ✅ Fixed get_ads_insights()
function get_ads_insights() {
  var insights_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Ad Insights');
  insights_sheet.getDataRange().clearContent();

  var fields = ['date_start', 'date_stop', 'ad_name', 'impressions', 'clicks', 'cpc', 'cpm', 'cpp', 'ctr', 'purchase_roas', 'spend', 'reach', 'updated_time'];

  Logger.log("Calling get_data with fields: " + JSON.stringify(fields));

  var data = get_data('insights', '&level=ad&date_preset=maximum', fields);

  if (data && data.length > 1) {
    insights_sheet.getRange(1, 1, data.length, data[0].length).setValues(data);
  }
}

// ✅ Fixed get_ads()
function get_ads() {
  var ads_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Ads');
  ads_sheet.getDataRange().clearContent();

  var fields = ['id', 'name', 'status', 'adlabels', 'adset_id', 'bid_amount', 'campaign_id', 'configured_status', 'conversion_domain', 'created_time', 'effective_status', 'preview_shareable_link', 'source_ad_id'];

  Logger.log("Calling get_data with fields: " + JSON.stringify(fields));

  var data = get_data('ads', '', fields);
  if (data) {
    ads_sheet.getRange(1, 1, data.length, data[0].length).setValues(data);
  }
}

// ✅ Fixed get_data() with pagination handling
function get_data(endpoint, params, fields) {
  if (!Array.isArray(fields)) {
    Logger.log("Error: fields is not an array. Converting to array.");
    if (typeof fields === 'string') {
      fields = fields.split(','); // Convert "id,name,status" into ['id', 'name', 'status']
    } else {
      Logger.log("Critical Error: fields is not iterable.");
      return null;
    }
  }

  var accounts_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Ad Accounts');
  var accounts_data = accounts_sheet.getDataRange().getValues();

  if (accounts_data.length < 2) {
    SpreadsheetApp.getActive().toast('No Ad Accounts Registered');
    return null;
  }

  accounts_data.shift(); // Remove headers

  var data = [];
  data.push(['ad_account', ...fields]); // Add headers

  accounts_data.forEach(function (account) {
    if (!account[0]) return;

    var url = `https://graph.facebook.com/${API_VERSION}/${account[2]}/${endpoint}?access_token=${ACCESS_TOKEN}${params}&fields=${fields.join(',')}`;

    while (url) { // Handle pagination to fetch all data
      Logger.log("Fetching URL: " + url);

      var response = UrlFetchApp.fetch(url, { 'muteHttpExceptions': true }).getContentText();
      var json = JSON.parse(response);

      if (json.data) {
        json.data.forEach(function (entry) {
          var new_entry = [account[1]]; // Start with ad account name

          fields.forEach(function (key) {
            new_entry.push(entry[key] || ''); // Ensure missing fields don't cause errors
          });

          data.push(new_entry);
        });
      }

      url = json.paging && json.paging.next ? json.paging.next : null; // Get next page URL
    }
  });

  return data.length > 1 ? data : null;
}

// ✅ Fixed get_ad_accounts()
function get_ad_accounts() {
  var url = `https://graph.facebook.com/${API_VERSION}/me/adaccounts?limit=100&fields=name,id&access_token=${ACCESS_TOKEN}`;
  var response = UrlFetchApp.fetch(url, { 'muteHttpExceptions': true });
  var json = JSON.parse(response);
  var accounts = [];

  if (json.data) {
    json.data.forEach(function (account) {
      accounts.push([account.name, account.id]);
    });
  }

  if (accounts.length > 0) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Ad Accounts');
    sheet.getRange(2, 2, sheet.getLastRow() - 1, sheet.getLastColumn() - 1).clearContent();
    sheet.getRange(2, 2, accounts.length, accounts[0].length).setValues(accounts);
  }
}

// ✅ Fixed get_campaigns_insights()
function get_campaigns_insights() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Campaign Insights');
  sheet.getDataRange().clearContent();

  var fields = ['created_time', 'date_start', 'date_stop', 'campaign_name', 'impressions', 'clicks', 'cpc', 'cpm', 'cpp', 'ctr', 'purchase_roas', 'spend', 'reach', 'wish_bid', 'conversions', 'conversion_values', 'cost_per_conversion', 'updated_time'];

  var data = get_data('insights', '&level=campaign&date_preset=maximum', fields);
  if (data) {
    sheet.getRange(1, 1, data.length, data[0].length).setValues(data);
  }
}

// ✅ Fixed get_adset_insights()
function get_adset_insights() {
  var insights_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Adset Insights');
  insights_sheet.getDataRange().clearContent();

  var fields = ['date_start', 'date_stop', 'adset_name', 'impressions', 'clicks', 'cpc', 'cpm', 'cpp', 'ctr', 'purchase_roas', 'spend', 'reach', 'updated_time'];

  var data = get_data('insights', '&level=adset&date_preset=maximum', fields);
  if (data) {
    insights_sheet.getRange(1, 1, data.length, data[0].length).setValues(data);
  }
}

// ✅ Fixed get_campaigns()
function get_campaigns() {
  var campaigns_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Campaigns');
  campaigns_sheet.getDataRange().clearContent();

  var fields = ['id', 'name', 'status', 'objective', 'account_id', 'created_time', 'budget_remaining', 'daily_budget', 'effective_status', 'lifetime_budget', 'start_time', 'stop_time', 'updated_time'];

  var data = get_data('campaigns', '', fields);
  if (data) {
    campaigns_sheet.getRange(1, 1, data.length, data[0].length).setValues(data);
  }
}
