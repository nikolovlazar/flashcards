// Update category
export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  const id = parseInt(params.id, 10);
  const formData = await request.formData();

  const res = await fetch(`http://api:3001/categories/${id}`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.text();
    return new Response(error, { status: res.status });
  }

  const category = await res.json();

  return Response.json({ category }, { status: 200 });
}

// Delete category
export async function DELETE(
  _: Request,
  { params }: { params: { id: string } },
) {
  const id = parseInt(params.id, 10);

  const res = await fetch(`http://localhost:3001/categories/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const error = await res.text();
    return new Response(error, { status: res.status });
  }

  return Response.json({ success: true }, { status: 200 });
}
