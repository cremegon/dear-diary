import { Request, Response } from "express";
import { Pool } from "pg";
import { config } from "../config";
import { JSDOM } from "jsdom";
import puppeteer from "puppeteer";
import { send_PDF_Email } from "../middleware/sendEmail";

const pool = new Pool(config.db);

export const compileDiary = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { diaryURL } = req.params;
  const { trustees } = req.body;
  console.log("finishing diary...", trustees);

  const now = new Date();
  const formattedDateNow = now.toISOString().replace("T", " ").slice(0, 23);

  for (const { diaryId, name, email, address, phone } of trustees) {
    console.log(diaryId, name, email, address, phone);
    await pool.query(
      "INSERT INTO trustees(diary_id,name,email,address,phone) VALUES ((SELECT id FROM diaries WHERE url = $1),$2,$3,$4,$5)",
      [diaryURL, name, email, address, phone]
    );
  }

  const diaryDetails = await pool.query(
    "SELECT user_id,title FROM diaries WHERE url = $1",
    [diaryURL]
  );

  const { user_id, title } = diaryDetails.rows[0];
  console.log("dont mind me...", user_id, title);

  const username = await pool.query("SELECT name FROM users WHERE id = $1", [
    user_id,
  ]);
  const author = username.rows[0].name;

  console.log("name and title!", author, title);

  await pool.query("UPDATE diaries SET completed_at = $1 WHERE url = $2", [
    formattedDateNow,
    diaryURL,
  ]);

  const query = await pool.query(
    "SELECT * from chapters WHERE diary_id = (SELECT id FROM diaries WHERE url = $1) AND content IS NOT NULL ORDER BY id ASC",
    [diaryURL]
  );
  if (query.rows.length < 1)
    return res.status(404).json({ message: "Error at Diary Compiling..." });

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
  const pdfFile = await page.pdf({ path: "output.pdf", format: "A4" });
  const pdfBuffer = Buffer.from(pdfFile);
  await browser.close();

  await pool.query("UPDATE diaries SET pdf = $1 WHERE url = $2", [
    pdfFile,
    diaryURL,
  ]);

  for (let i = 0; i < trustees.length; i++) {
    send_PDF_Email(trustees[i].email, title, author, pdfBuffer);
  }

  console.log("Successfully Created Diary PDF");
  return res.status(200).json({
    data: data,
    message: "Diary Successfully Compiled and Saved",
  });
};
