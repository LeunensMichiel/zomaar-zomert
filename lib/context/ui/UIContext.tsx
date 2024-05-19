import { createContext } from 'react';

export type UIState = {
  displayModal: boolean;
  modalView: ModalViews;
  modalTitle?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: Record<string, any>;
  openModal: () => void;
  closeModal: () => void;
  setModalView: (
    view: ModalViews,
    title?: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: Record<string, any>
  ) => void;
};

export const INITIAL_UI_STATE: UIState = {
  displayModal: false,
  modalView: 'NO_VIEW',
  modalTitle: '',
  data: undefined,
  closeModal: () => undefined,
  openModal: () => undefined,
  setModalView: () => undefined,
};

export type ModalViews = 'NO_VIEW' | 'ARTIST_VIEW' | 'LANGUAGE_VIEW';

export const UIContext = createContext<UIState>(INITIAL_UI_STATE);

UIContext.displayName = 'UIContext';
