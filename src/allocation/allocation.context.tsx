import React, { createContext } from 'react';

interface AllocationProviderProps {
  children: React.ReactNode;
}

type Dispatch = (action: any) => void;

interface AllocationProps {}

const initialState: AllocationProps = {};

const AllocationStateContext = createContext<AllocationProps | undefined>(undefined);
const AllocationDispatchContext = createContext<Dispatch | undefined>(undefined);

function allocationReducer(state: AllocationProps, action: any) {
  switch (action.type) {
    case 'TYPE': {
      return { ...state };
    }

    default: {
      throw new Error('Unhandled action type');
    }
  }
}

function AllocationProvider({ children }: AllocationProviderProps) {
  const [state, dispatch] = React.useReducer(allocationReducer, initialState);
  return (
    <AllocationStateContext.Provider value={state}>
      <AllocationDispatchContext.Provider value={dispatch as any}>{children}</AllocationDispatchContext.Provider>
    </AllocationStateContext.Provider>
  );
}

function useAllocationState() {
  const context = React.useContext(AllocationStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within a App Provider');
  }
  return context;
}

function useAllocationDispatch() {
  const context = React.useContext(AllocationDispatchContext);
  if (context === undefined) {
    throw new Error('Must be used within a Allocation Provider');
  }
  return context;
}

export { AllocationProvider, useAllocationDispatch, useAllocationState };
