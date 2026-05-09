import type { TypingMode } from '../api/results'

export type ResultSaveStatus = 'guest' | 'saving' | 'saved' | 'error'

export type CompletedTestResult = {
  textId?: string
  textTitle: string
  mode: TypingMode
  durationSeconds: number
  wpm: number
  accuracy: number
  correctCharacters: number
  incorrectCharacters: number
  totalKeyPresses: number
  progress: number
  wordCount: number
  completedAt: string
  saveStatus: ResultSaveStatus
  saveError?: string
}
