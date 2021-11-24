import { createContext } from 'react';

interface ListPostContext {
  currentSelectedThread: string;
  setCurrentSelectedThread: (threadId: string) => void;
}

const ListPostContext = createContext<ListPostContext>({
  currentSelectedThread: '',
  setCurrentSelectedThread: () => {},
});

export default ListPostContext;
