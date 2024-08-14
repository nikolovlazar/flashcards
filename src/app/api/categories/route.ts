import * as helpers from "@/prisma/helpers";
import slugify from "slugify";

// Create Category
export async function PUT(request: Request) {
  const formData = await request.formData();

  const data = {
    name: formData.get("name")!.toString(),
  };

  if (data.name.length < 5) {
    return new Response("Name must be at least 5 characters", { status: 400 });
  }

  const slug = slugify(data.name, { lower: true });

  const existingCategory = await helpers.getCategory(slug);

  if (existingCategory) {
    return new Response("Category already exists", { status: 400 });
  }

  const category = await helpers.createCategory({
    name: data.name,
    slug,
  });

  return Response.json(category, { status: 201 });
}
