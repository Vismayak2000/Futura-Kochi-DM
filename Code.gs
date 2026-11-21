const SHEET_NAME = "Enquiries";

const HEADERS = [
  "Submission Date and Time",
  "Full Name",
  "Mobile Number",
  "Email Address",
  "Preferred Learning Mode",
  "Course Interest",
  "Message"
];

function setup() {
  const sheet = getOrCreateSheet();
  const widths = [180, 180, 150, 230, 190, 380, 380];

  sheet.setFrozenRows(1);
  widths.forEach(function (width, index) {
    sheet.setColumnWidth(index + 1, width);
  });
}

function doGet() {
  return HtmlService.createHtmlOutput("Futura Labs enquiry endpoint is active.");
}

function doPost(e) {
  const submissionId = getParameter(e, "submissionId") || Utilities.getUuid();

  try {
    const sheet = getOrCreateSheet();

    sheet.appendRow([
      new Date(),
      clean(getParameter(e, "fullName")),
      clean(getParameter(e, "mobile")),
      clean(getParameter(e, "email")),
      clean(getParameter(e, "learningMode")),
      clean(getParameter(e, "courseInterest")),
      clean(getParameter(e, "message"))
    ]);

    return buildResponse({
      status: "success",
      submissionId: submissionId,
      message: "Enquiry recorded."
    });
  } catch (error) {
    return buildResponse({
      status: "error",
      submissionId: submissionId,
      message: "Enquiry could not be recorded."
    });
  }
}

function getOrCreateSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);

  const currentHeaders = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  if (currentHeaders.join("||") !== HEADERS.join("||")) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }

  return sheet;
}

function getParameter(e, name) {
  if (!e || !e.parameter) return "";
  return e.parameter[name] || "";
}

function clean(value) {
  return String(value || "").trim().slice(0, 1000);
}

function buildResponse(payload) {
  const serialized = JSON.stringify(payload)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");

  const html =
    "<!doctype html><html><body><script>window.parent.postMessage(" +
    serialized +
    ', "*");</script></body></html>';

  return HtmlService.createHtmlOutput(html)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
