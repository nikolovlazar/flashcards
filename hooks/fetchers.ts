export function getter(url: string) {
  return fetch(url).then((res) => res.json());
}
