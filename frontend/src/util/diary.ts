export async function handleDiary(e: React.FormEvent, title: string) {
  console.log("creating new diary...");
  e.preventDefault();
  const response = await fetch("http://localhost:5000/new-diary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
    credentials: "include",
  });

  if (!response.ok) return "An Error Occured with Diaries";

  const data = await response.json();
  console.log("NEW DATA!", data.message);
}

export async function deleteDiary(e: React.MouseEvent, diaryId: string) {
  console.log("deleting diary...", diaryId);
  e.preventDefault();
  await fetch(`http://localhost:5000/delete-diary/${diaryId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
}

export async function deleteChapter(e: React.MouseEvent, chapterId: string) {
  console.log("deleting chapter...", chapterId);
  e.preventDefault();
  await fetch(`http://localhost:5000/delete-chapter/${chapterId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
}

export async function handleChapter(e: React.FormEvent, url: string) {
  e.preventDefault();
  const [fontFamily, fontSize] = ["Ariel", 20];

  const response = await fetch("http://localhost:5000/new-chapter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fontFamily, fontSize, url }),
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) return data.message;

  return data;
}

export async function checkDiary() {
  console.log("checking diary entries...");

  const response = await fetch(`http://localhost:5000/check-diary`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) return `NO diary Found`;

  const data = await response.json();

  return data;
}

export async function checkChapter(params: string) {
  console.log("checking chapter entries...");

  const response = await fetch(
    `http://localhost:5000/check-chapter?key=${params}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  );

  if (!response.ok) return `NO chapter Found`;

  const data = await response.json();

  return data;
}

export async function saveToDatabase(
  title: string,
  content: string,
  url: string,
  font: string,
  fontsize: number
) {
  const response = await fetch("http://localhost:5000/save-to-db", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content, url, font, fontsize }),
    credentials: "include",
  });

  const data = await response.json();
  return data;
}

export async function loadFromDatabase(url: string) {
  const response = await fetch("http://localhost:5000/load-from-db", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
    credentials: "include",
  });

  const data = await response.json();
  return data;
}

export async function saveCoverArt(image: string, diaryId: string) {
  const response = await fetch(
    `http://localhost:5000/save-cover-art/${diaryId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image }),
      credentials: "include",
    }
  );
  if (!response.ok) {
    console.log("error occured for cover art from backend");
    return;
  }
  const data = await response.json();
  return data;
}

export async function fetchCoverArt(diaryId: string) {
  const response = await fetch(
    `http://localhost:5000/load-cover-art/${diaryId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  );

  if (!response.ok) {
    console.log("Error Retrieving Cover Art at Frontend");
    return "";
  }

  const coverArt = await response.json();
  return coverArt.data;
}

export async function finishDiary(diaryURL: string, trustees: object[]) {
  console.log("sending compile request...", trustees);
  const response = await fetch(
    `http://localhost:5000/finish-diary/${diaryURL}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trustees }),
      credentials: "include",
    }
  );

  if (!response.ok) return null;
}

export async function addEntrustee(diaryURL: string, trustees: object[]) {
  console.log("adding new entrustee from frontend...");
  const response = await fetch(
    `http://localhost:5000/add-entrustee/${diaryURL}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trustees }),
      credentials: "include",
    }
  );

  if (!response.ok) return false;
  return true;
}

export async function fetchArchives() {
  console.log("checking archives...");

  const response = await fetch(`http://localhost:5000/check-archives`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) return `NO Archives Found`;

  const data = await response.json();

  return data;
}

export async function fetchDiary(diaryURL: string) {
  const response = await fetch(
    `http://localhost:5000/fetch-diary/${diaryURL}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  );

  if (!response.ok) return `NO Archives Found`;

  const data = await response.json();

  return data;
}
