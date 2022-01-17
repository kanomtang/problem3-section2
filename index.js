const puppeteer = require("puppeteer");

async function scrape(fundName) {
  const browser = await puppeteer.launch({});
  const page = await browser.newPage();

  // Navigate to target page
  await page.goto("https://codequiz.azurewebsites.net/");

  // Click button
  await (await page.waitForSelector("body > input[type=button]")).click();

  // Wait for table finish render
  await page.waitForSelector("body > table > tbody");

  const fundCollection = await page.evaluate(() => {
    const rows = document.querySelectorAll("body > table > tbody > tr");
    return Array.from(rows, (row) => {
      const columns = row.querySelectorAll("td");
      return Array.from(columns, (column) => column.innerText);
    });
  });

  for (let index = 0; index < fundCollection.length; index++) {
    // Looking at given Fund Name
    if (fundName === fundCollection[index][0]) {
      // Print Nav of given fund
      console.log(fundCollection[index][1]);
      break;
    }
  }

  // Logout
  await (await page.waitForSelector("body > input[type=button]")).click();
  browser.close();
}
const fundName = process.argv.slice(2, 3);
scrape(fundName.pop());
