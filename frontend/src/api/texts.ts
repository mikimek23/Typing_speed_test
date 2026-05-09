import { api, unwrapResponse } from './axios'

export type Difficulty = 'easy' | 'medium' | 'hard'
export type SourceType = 'DEFAULT' | 'USER'

export type TypingText = {
  id: string
  title: string
  content: string
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  source_type: SourceType
  wordCount: number
  user_id?: string | null
  created_at: string
  updated_at: string
}

export type TextPayload = {
  title: string
  content: string
  difficulty: Difficulty
}

type TextListResponse = {
  count: number
  texts: TypingText[]
}

const normalizeTextList = (payload: TextListResponse | TypingText[]) => {
  if (Array.isArray(payload)) {
    return {
      count: payload.length,
      texts: payload,
    }
  }

  return {
    count: payload?.count ?? payload?.texts?.length ?? 0,
    texts: payload?.texts ?? [],
  }
}

export const getDefaultTexts = async (difficulty?: Difficulty) => {
  const response = await api.get('/texts/default', {
    params: difficulty ? { difficulty } : undefined,
  })
  return normalizeTextList(
    unwrapResponse<TextListResponse | TypingText[]>(response),
  )
}

export const getMyTexts = async (difficulty?: Difficulty) => {
  const response = await api.get('/texts/me', {
    params: difficulty ? { difficulty } : undefined,
  })
  return normalizeTextList(
    unwrapResponse<TextListResponse | TypingText[]>(response),
  )
}

export const createMyText = async (payload: TextPayload) => {
  const response = await api.post('/texts/me', payload)
  return unwrapResponse<TypingText>(response)
}

export const updateMyText = async (
  id: string,
  payload: Partial<TextPayload>,
) => {
  const response = await api.put(`/texts/me/${id}`, payload)
  return unwrapResponse<{ message?: string }>(response)
}

export const deleteMyText = async (id: string) => {
  const response = await api.delete(`/texts/me/${id}`)
  return unwrapResponse<{ message?: string }>(response)
}
