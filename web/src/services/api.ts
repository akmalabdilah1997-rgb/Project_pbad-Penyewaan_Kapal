async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`http://localhost:3000/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const payload = await response.json()
  if (!response.ok || payload.success === false) throw new Error(payload.error || payload.message || 'Permintaan gagal')
  return payload.data as T
}

export const kapalApi = {
  list: () => request<import('../types/ship').Ship[]>('/kapal'),
  create: (body: object) => request<import('../types/ship').Ship>('/kapal', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: number, body: object) => request<import('../types/ship').Ship>(`/kapal/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (id: number) => request<null>(`/kapal/${id}`, { method: 'DELETE' }),
}
