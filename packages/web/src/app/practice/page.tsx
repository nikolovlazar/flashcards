import * as helpers from "@/prisma/helpers";
import Practice from "./practice-session";

export const dynamic = "force-dynamic";

export default async function Manage() {
  const categories = await helpers.getCategories();

  return <Practice categories={categories} />;
}
