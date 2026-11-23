export type MediaUploadTicket = {
  path: string;
  token: string;
};

export type MediaActionState = {
  error?: string;
  ok?: boolean;
  ticket?: MediaUploadTicket;
};

export const initialMediaActionState: MediaActionState = {};
