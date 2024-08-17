// Create Category
export async function PUT(request: Request) {
  const formData = await request.formData();

  const res = await fetch("http://api:3001/categories", {
    body: formData,
    method: "PUT",
  });

  if (!res.ok) {
    const error = await res.text();
    return new Response(error, { status: res.status });
  }

  const category = await res.json();
  return Response.json(category, { status: 201 });
}
