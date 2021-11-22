import { createContext } from 'react';

interface CommentContext {
  dataReplingComment: string;
  setDataReplingComment: (state: string) => void;
  typing: {
    id: string;
    username: string;
  };
  setTyping: (state: any) => void;
  handleRely: (idRepling: string, usernameRepling: string) => void;
}

export const CommentContext = createContext<CommentContext>({
  dataReplingComment: '',
  setDataReplingComment: () => {},
  typing: { id: '', username: '' },
  setTyping: () => {},
  handleRely: () => {},
});
