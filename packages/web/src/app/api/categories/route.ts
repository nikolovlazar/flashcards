// Create Category
export async function POST(request: Request) {
  const formData = await request.formData();

  const res = await fetch('http://api:8000/categories', {
    body: JSON.stringify(Object.fromEntries(formData)),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const error = await res.text();
    return new Response(error, { status: res.status });
  }

  const category = (await res.json()).results.category;
  return Response.json(category, { status: 201 });
}
