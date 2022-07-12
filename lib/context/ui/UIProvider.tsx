import { ThemeProvider } from 'next-themes';
import { FC, useMemo, useReducer } from 'react';

import { INITIAL_UI_STATE, ModalViews, UIContext, UIState } from './UIContext';

type Action =
  | {
      type: 'OPEN_MODAL';
    }
  | {
      type: 'CLOSE_MODAL';
    }
  | {
      type: 'SET_MODAL_VIEW';
      view: ModalViews;
      title?: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data?: Record<string, any>;
    };

const uiReducer = (state: UIState, action: Action): UIState => {
  switch (action.type) {
    case 'OPEN_MODAL': {
      return {
        ...state,
        displayModal: true,
      };
    }
    case 'CLOSE_MODAL': {
      return {
        ...state,
        modalView: 'NO_VIEW',
        displayModal: false,
        modalTitle: '',
        data: undefined,
      };
    }
    case 'SET_MODAL_VIEW': {
      return {
        ...state,
        modalView: action.view,
        displayModal: false,
        modalTitle: action.title,
        data: action?.data,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
};

const UIProvider: FC = (props) => {
  const [state, dispatch] = useReducer(uiReducer, INITIAL_UI_STATE);

  const openModal = () => dispatch({ type: 'OPEN_MODAL' });
  const closeModal = () => dispatch({ type: 'CLOSE_MODAL' });

  const setModalView = (
    view: ModalViews,
    title?: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: Record<string, any>
  ) => dispatch({ type: 'SET_MODAL_VIEW', view, title, data });

  const value = useMemo(
    () => ({
      ...state,
      openModal,
      closeModal,
      setModalView,
    }),
    [state]
  );

  return <UIContext.Provider value={value} {...props} />;
};

export const ManagedUIProvider: FC = ({ children }) => (
  <UIProvider>
    <ThemeProvider
      enableSystem={false}
      enableColorScheme
      disableTransitionOnChange={true}
      defaultTheme="system"
      themes={['light']}
    >
      {children}
    </ThemeProvider>
  </UIProvider>
);
