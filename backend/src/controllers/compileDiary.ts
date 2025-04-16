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
    `<!DOCTYPE html><html><head><title>PDF Document</title></head><body></body></html>`
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

    h1.innerHTML = title;
    h1.style.fontFamily = font_family;
    h1.style.fontSize = font_size;
    div.innerHTML = content;
    div.style.fontFamily = font_family;
    div.style.fontSize = font_size;

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
