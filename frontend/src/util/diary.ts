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

export async function handleChapter(e: React.FormEvent) {
  e.preventDefault();
  const [fontFamily, fontSize] = ["Ariel", 20];

  const response = await fetch("http://localhost:5000/new-chapter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fontFamily, fontSize }),
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
  url: string
) {
  const response = await fetch("http://localhost:5000/save-to-db", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content, url }),
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
