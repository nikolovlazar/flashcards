import * as helpers from "@/prisma/helpers";
import slugify from "slugify";

// Update category
export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  const formData = await request.formData();

  const data = {
    name: formData.get("name")!.toString(),
  };

  const id = parseInt(params.id, 10);

  const existingCategory = await helpers.getCategoryById(id);
  if (!existingCategory) {
    return new Response("Category doesn't exist", { status: 404 });
  }

  if (data.name.length < 5) {
    return new Response("Name must be at least 5 characters long", {
      status: 400,
    });
  }

  const slug = slugify(data.name, { lower: true });

  const category = await helpers.updateCategory(id, {
    name: data.name,
    slug,
  });

  return Response.json({ category }, { status: 200 });
}

// Delete category
export async function DELETE(
  _: Request,
  { params }: { params: { id: string } },
) {
  const id = parseInt(params.id, 10);

  const existingCategory = await helpers.getCategoryById(id);
  if (!existingCategory) {
    return new Response("Category doesn't exists", { status: 404 });
  }

  await helpers.deleteCategory(existingCategory.slug);

  return Response.json({ success: true }, { status: 200 });
}
