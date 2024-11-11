import Practice from './practice-session';

export const dynamic = 'force-dynamic';

const getCategories = async () => {
  const res = await fetch('http://api:8000/categories');
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }
  return (await res.json()).results.categories;
};

export default async function Manage() {
  const categories = await getCategories();

  return <Practice categories={categories} />;
}
