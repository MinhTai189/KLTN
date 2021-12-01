import { createContext } from 'react';

interface PostViewContext {
  handleSubmitReport: (isPost: boolean, id: string, content: string) => void;
}

const PostViewContext = createContext<PostViewContext>({
  handleSubmitReport: () => {},
});

export default PostViewContext;
