const API_URL = `${import.meta.env.VITE_REACT_APP_API_URL}/api/users`;

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Error logging in');
  return data;
}

export async function register({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
    credentials: 'include',
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Error registering user');
  return data;
}

export async function checkAuth() {
  const response = await fetch(`${API_URL}/auth`, {
    credentials: 'include',
  });
  if (response.status === 401) return null;
  const data = await response.json();
  return data;
}

export async function logout() {
  const response = await fetch(`${API_URL}/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Error logging out');
  }
  return true;
}

export async function updateProfile({ name }: { name: string }) {
  const response = await fetch(`${API_URL}/profile`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
    credentials: 'include',
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Error updating profile');
  return data;
}

export async function likeRecipe(recipeId: string) {
  const response = await fetch(`${API_URL}/like/recipe/${recipeId}`, {
    method: 'POST',
    credentials: 'include',
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Error liking recipe');
  return data.likedRecipes;
}

export async function unlikeRecipe(recipeId: string) {
  const response = await fetch(`${API_URL}/unlike/recipe/${recipeId}`, {
    method: 'POST',
    credentials: 'include',
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Error unliking recipe');
  return data.likedRecipes;
}

export async function likeCookbook(cookbookId: string) {
  const response = await fetch(`${API_URL}/like/cookbook/${cookbookId}`, {
    method: 'POST',
    credentials: 'include',
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Error liking cookbook');
  return data.likedCookbooks;
}

export async function unlikeCookbook(cookbookId: string) {
  const response = await fetch(`${API_URL}/unlike/cookbook/${cookbookId}`, {
    method: 'POST',
    credentials: 'include',
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Error unliking cookbook');
  return data.likedCookbooks;
}
