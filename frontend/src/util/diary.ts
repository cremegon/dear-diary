export async function handleDiary(e: React.FormEvent) {
  console.log("creating new diary...");
  e.preventDefault();
  const title = "DJ Racist";
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
  const [title, content, fontFamily, fontSize] = [
    "Big Fall",
    "<div>theniggachin?</div>",
    "Ariel",
    20,
  ];

  const response = await fetch("http://localhost:5000/new-chapter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content, fontFamily, fontSize }),
    credentials: "include",
  });

  const data = await response.json();
  console.log(data.message);
}

export async function checkDiary() {
  console.log("checking diary entries...");

  const response = await fetch("http://localhost:5000/check-diary", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) return "NO Diaries Found";

  const data = await response.json();

  return data;
}
