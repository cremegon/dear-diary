export async function handleDiary(e: React.FormEvent) {
  console.log("creating new diary...");
  e.preventDefault();
  const response = await fetch("http://localhost:5000/new-diary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
    credentials: "include",
  });

  if (!response.ok) return "An Error Occured with Diaries";

  const data = await response.json();
  console.log("NEW DATA!", data.message);
}

export async function handleChapter(e: React.FormEvent) {
  e.preventDefault();
  const [id, content, fontFamily, fontSize] = [
    69,
    "<div>theniggachin?</div>",
    "Ariel",
    20,
  ];

  const response = await fetch("http://localhost:5000/new-chapter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, content, fontFamily, fontSize }),
    credentials: "include",
  });

  if (!response.ok) return "An Error Occured with Chapters";

  const data = await response.json();
  console.log(data.message);
}
