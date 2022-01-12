import { ChatGroup } from 'models';
import { createContext } from 'react';

interface Context {
  activedGroup: ChatGroup | undefined;
  setActivedGroup: (state: ChatGroup) => void;
  showListOnline: boolean;
  setShowListOnline: (state: boolean) => void;
  setShowListMember: (state: boolean) => void;
}

const ChatContext = createContext<Context>({
  activedGroup: undefined,
  setActivedGroup: () => {},
  showListOnline: true,
  setShowListOnline: () => {},
  setShowListMember: () => {},
});

export default ChatContext;
