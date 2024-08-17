export async function PUT(request: Request) {
  const formData = await request.formData();

  const res = await fetch("http://api:3001/flashcards", {
    body: formData,
    method: "PUT",
  });

  if (!res.ok) {
    const error = await res.text();
    return new Response(error, { status: res.status });
  }

  const flashcard = await res.json();

  return Response.json({ flashcard }, { status: 201 });
}
