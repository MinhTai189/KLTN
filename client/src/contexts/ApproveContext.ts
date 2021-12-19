import { createContext } from 'react';

export interface OpenModalApprove {
  type: string;
  id: string;
}

interface ApproveContextState {
  openModalApprove: OpenModalApprove;
  setOpenModalApprove: (state: OpenModalApprove) => void;
}

export const initialApproveContext = {
  type: '',
  id: '',
};

const ApproveContext = createContext<ApproveContextState>({
  openModalApprove: initialApproveContext,
  setOpenModalApprove: () => {},
});

export default ApproveContext;
