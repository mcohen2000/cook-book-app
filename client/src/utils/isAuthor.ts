export function isAuthor(
  currentUser: string,
  resource: string
): boolean {
  if (!currentUser || !resource ) return false;
  return resource === currentUser;
}
