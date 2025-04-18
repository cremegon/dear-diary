import { Request, Response } from "express";
import { Pool } from "pg";
import { config } from "../config";
import { JSDOM } from "jsdom";
import puppeteer, { Puppeteer } from "puppeteer";

const pool = new Pool(config.db);

export const compileDiary = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { diaryURL } = req.params;
  console.log("finishing diary...", diaryURL);

  const query = await pool.query(
    "SELECT * from chapters WHERE diary_id = (SELECT id FROM diaries WHERE url = $1) AND content IS NOT NULL ORDER BY id ASC",
    [diaryURL]
  );
  if (query.rows.length < 1)
    return res.status(404).json({ message: "No Cover Art Found Found" });
  const data = query.rows;

  const DOM = new JSDOM(
    `<!DOCTYPE html><html><head><title>PDF Document</title> <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Barrio&family=Chewy&family=DynaPuff:wght@400..700&family=Enriqueta:wght@400;500;600;700&family=Fascinate&family=Freckle+Face&family=Gabarito:wght@400..900&family=Geo:ital@0;1&family=Homemade+Apple&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Jacquard+12&family=Lacquer&family=Lugrasimo&family=Maiden+Orange&family=Merriweather+Sans:ital,wght@0,300..800;1,300..800&family=Poiret+One&family=Radley:ital@0;1&family=STIX+Two+Text:ital,wght@0,400..700;1,400..700&family=Silkscreen:wght@400;700&family=Smokum&family=Sour+Gummy:ital,wght@0,100..900;1,100..900&family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&family=Special+Elite&family=UnifrakturCook:wght@700&family=Yellowtail&display=swap"
      rel="stylesheet"
    /></head><body></body></html>`
  );
  const document = DOM.window.document;

  for (const {
    id,
    diary_id,
    title,
    created_at,
    content,
    font_family,
    font_size,
    url,
  } of data) {
    const h1 = document.createElement("h1");
    const div = document.createElement("div");
    const pageBreakDiv = document.createElement("div");

    pageBreakDiv.style.pageBreakBefore = "always";

    h1.innerHTML = title;
    h1.style.fontFamily = "New Times Roman";
    h1.style.fontSize = "3rem";
    h1.style.textAlign = "center";

    div.innerHTML = content;
    div.style.fontFamily = font_family;
    div.style.fontSize = String(font_size) + "px";

    document.body.appendChild(pageBreakDiv);
    document.body.appendChild(h1);
    document.body.appendChild(div);
  }
  const htmlContent = DOM.serialize();

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setContent(htmlContent);
  await page.pdf({ path: "output.pdf", format: "A4" });
  await browser.close();

  return res.status(200).json({
    data: data,
    message: "Found All Relevant Chapters in Diary",
  });
};
