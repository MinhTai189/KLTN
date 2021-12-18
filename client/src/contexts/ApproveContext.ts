import { createContext } from 'react';

export interface OpenModalApprove {
  type: string;
  id: string;
}

interface ApproveContextState {
  openModalApprove: OpenModalApprove;
  setOpenModalApprove: (state: OpenModalApprove) => void;
}

const ApproveContext = createContext<ApproveContextState>({
  openModalApprove: {
    type: '',
    id: '',
  },
  setOpenModalApprove: () => {},
});

export default ApproveContext;
