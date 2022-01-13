import { createContext } from 'react';

interface CommentContextModel {
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

export const CommentContext = createContext<CommentContextModel>({
  typing: { id: '', username: '' },
  setTyping: () => {},
  handleRely: () => {},
  handleSubmitReply: () => {},
});
