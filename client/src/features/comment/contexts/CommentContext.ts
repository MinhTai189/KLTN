import { createContext } from 'react';

interface CommentContext {
  typing: {
    id: string;
    username: string;
  };
  setTyping: (state: any) => void;
  handleRely: (idRepling: string, usernameRepling: string) => void;
  handleSubmitReply: (
    commentReplyId: string,
    userId: string,
    content: string
  ) => void;
}

export const CommentContext = createContext<CommentContext>({
  typing: { id: '', username: '' },
  setTyping: () => {},
  handleRely: () => {},
  handleSubmitReply: () => {},
});
