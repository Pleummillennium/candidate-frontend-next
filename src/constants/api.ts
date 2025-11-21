// API related constants

export const API_ENDPOINTS = {
  CANDIDATES: '/candidates',
  CANDIDATE_BY_ID: (id: number) => `/candidates/${id}`,
  CANDIDATE_ARCHIVE: (id: number) => `/candidates/${id}/archive`,
  CANDIDATE_UNARCHIVE: (id: number) => `/candidates/${id}/unarchive`,
} as const;

export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE = 1;
