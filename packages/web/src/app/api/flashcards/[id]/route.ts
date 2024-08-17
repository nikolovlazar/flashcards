// Update flashcard
export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  const formData = await request.formData();
  const id = parseInt(params.id, 10);

  const res = await fetch(`http://api:3001/flashcards/${id}`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.text();
    return new Response(error, { status: res.status });
  }

  const updatedFlashcard = await res.json();

  return Response.json({ flashcard: updatedFlashcard }, { status: 200 });
}

// Delete flashcard
export async function DELETE(
  _: Request,
  { params }: { params: { id: string } },
) {
  const id = parseInt(params.id, 10);

  const res = await fetch(`http://api:3001/flashcards/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const error = await res.text();
    return new Response(error, { status: res.status });
  }

  return new Response("Flashcard deleted successfully!", { status: 200 });
}
