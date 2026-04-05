// scripts/scrapeSchools.js

const fs = require("fs");
const puppeteer = require("puppeteer");

async function scrape() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(
    "https://www.nwforensics.org/schools/list-of-college-speech-debate-programs.htm",
    { waitUntil: "networkidle0" }
  );

  // Grab all text in the main body
  const bodyText = await page.evaluate(() => document.body.innerText);

  // Split by lines
  const lines = bodyText.split("\n").map((l) => l.trim());

  const schools = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Look for the region line
    if (line.includes("Region where this school is located")) {
      // Extract city and state
      const match = line.match(/\((.*?),\s*([A-Z]{2})\)/);
      if (!match) continue;
      const city = match[1].trim();
      const state = match[2].trim();

      // Move backward to find the school name
      let name = null;
      for (let j = i - 1; j >= 0; j--) {
        const candidate = lines[j];
        if (
          candidate &&
          !candidate.startsWith("Type of School") &&
          !candidate.startsWith("Events") &&
          !candidate.includes("information was last confirmed")
        ) {
          name = candidate;
          break;
        }
      }

      if (name) {
        schools.push({ name, city, state });
      }
    }
  }

  fs.writeFileSync("data/schools.json", JSON.stringify(schools, null, 2));
  console.log(`Saved ${schools.length} schools to schools.json`);

  await browser.close();
}

scrape().catch(console.error);