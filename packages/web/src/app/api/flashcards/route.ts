export async function POST(request: Request) {
  const formData = await request.formData();

  const res = await fetch('http://api:8000/flashcards', {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(Object.fromEntries(formData)),
    method: 'POST',
  });

  if (!res.ok) {
    const error = await res.text();
    return new Response(error, { status: res.status });
  }

  const flashcard = (await res.json()).results.flashcard;

  return Response.json({ flashcard }, { status: 201 });
}
