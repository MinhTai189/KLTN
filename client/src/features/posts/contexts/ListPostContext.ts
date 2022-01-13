import { createContext } from 'react';

interface ListPostContextModel {
  currentSelectedThread: string;
  setCurrentSelectedThread: (threadId: string) => void;
}

const ListPostContext = createContext<ListPostContextModel>({
  currentSelectedThread: '',
  setCurrentSelectedThread: () => {},
});

export default ListPostContext;
