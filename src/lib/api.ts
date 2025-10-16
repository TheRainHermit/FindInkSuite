export async function apiFetch<T>(
  endpoint: string,
  jwt: string | null,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = "http://localhost:8001/api"; // Cambia si tu backend está en otra URL/puerto

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
    ...options.headers,
  };
  console.log(headers)

  const response = await fetch(
    `${baseUrl}${endpoint.endsWith("/") ? endpoint : endpoint + "/"}`,
    {
      ...options,
      headers,
    }
  );

  console.log(response);
  
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${await response.text()}`);
  }

  return response.json();
}
