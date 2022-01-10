import { ChatGroup } from 'models';
import { createContext } from 'react';

interface Context {
  activedGroup: ChatGroup | undefined;
  setActivedGroup: (state: ChatGroup) => void;
  showListOnline: boolean;
  setShowShowListOnline: (state: boolean) => void;
}

const ChatContext = createContext<Context>({
  activedGroup: undefined,
  setActivedGroup: () => {},
  showListOnline: true,
  setShowShowListOnline: () => {},
});

export default ChatContext;
