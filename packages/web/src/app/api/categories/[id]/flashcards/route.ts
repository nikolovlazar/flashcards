// Get flashcards for category
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const categoryId = parseInt(params.id, 10);

  const categoryRes = await fetch(`http://api:3001/categories/${categoryId}`);

  if (!categoryRes.ok) {
    const error = await categoryRes.text();
    return new Response(error, { status: categoryRes.status });
  }
  const category = await categoryRes.json();

  const flashcardsRes = await fetch(
    `http://api:3001/categories/${categoryId}/flashcards`,
  );

  if (!flashcardsRes.ok) {
    const error = await flashcardsRes.text();
    return new Response(error, { status: flashcardsRes.status });
  }
  const flashcards = await flashcardsRes.json();

  return Response.json({
    category,
    flashcards,
  });
}
