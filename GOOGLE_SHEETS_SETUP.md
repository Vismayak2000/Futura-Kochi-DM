# Google Sheets enquiry setup

The landing page stores enquiries in a private Google Sheet through a Google Apps Script Web App. The frontend never contains a password, API key or spreadsheet credential.

## 1. Create the spreadsheet

1. Go to Google Sheets and create a blank spreadsheet, for example `Futura Labs Kochi Enquiries`.
2. In that spreadsheet, open `Extensions > Apps Script`.
3. Delete any starter code and paste the full contents of `Code.gs` from this folder.
4. Save the project.

## 2. Initialise the sheet

1. In Apps Script, select `setup` from the function dropdown.
2. Click `Run`.
3. Review and allow the requested permissions.
4. Confirm that an `Enquiries` tab appears with these headers: `Submission Date and Time`, `Full Name`, `Mobile Number`, `Email Address`, `Preferred Learning Mode`, `Course Interest`, `Message`.

## 3. Deploy the Web App

1. Click `Deploy > New deployment`.
2. Choose `Web app`.
3. Set `Execute as` to `Me`.
4. Set `Who has access` to `Anyone`.
5. Click `Deploy` and approve the authorization request.
6. Copy the `Web app URL`. It should end in `/exec`.

## 4. Connect the URL to the page

1. Open `js/script.js`.
2. Find this line near the enquiry form code:

   `const APPS_SCRIPT_URL = "";`

3. Replace it with the copied URL, for example:

   `const APPS_SCRIPT_URL = "https://script.google.com/macros/s/EXAMPLE/exec";`

4. Save the file.

## 5. Test

1. Open `index.html` in a browser or serve this folder locally.
2. Fill in the enquiry form and submit it.
3. Confirm that a new row appears in the `Enquiries` sheet.
4. Confirm that the page shows the success message only after the row is written.
5. Test validation by leaving required fields empty. No row should be added.

## Updating and troubleshooting

- If you edit `Code.gs`, deploy a new version and update the URL in `js/script.js` if the URL changes.
- If the form reports a connection error, check that the deployment is active, access is set to `Anyone`, and the URL ends in `/exec`.
- Keep the spreadsheet private. Anyone with the Web App URL can submit an enquiry, but they cannot read the sheet.
- The page shows success only when the Apps Script response matches the unique submission token, so a failed or timed-out submit never pretends to have succeeded.
