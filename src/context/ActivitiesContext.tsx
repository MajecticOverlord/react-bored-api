import React, { createContext, useReducer } from "react";
import _ from "lodash";

export interface IActivity {}

export interface IActivitiesState {
  activities: IActivity[];
}

export interface IActivitiesAction {
  type: string;
  payload: IActivity | string | number;
}

export interface IActivitiesContext {
  state: IActivitiesState;
  dispatch: React.Dispatch<IActivitiesAction>;
}

export interface IActivitiesProviderProps {
  initialState?: IActivitiesState;
}

const defaultState: IActivitiesState = { activities: [] };
const defaultDispatch: React.Dispatch<IActivitiesAction> = value => undefined;

const ActivitiesReducer = (
  state: IActivitiesState,
  action: IActivitiesAction
) => {
  switch (action.type) {
    case "add":
      // if (_.isPlainObject(action.payload)) {
      state.activities = [...state.activities, action.payload];
      // }
      return { ...state };
    default:
      return state;
  }
};

export const ActivitiesContext = createContext<IActivitiesContext>({
  state: defaultState,
  dispatch: defaultDispatch
});

export const ActivitiesProvider: React.FC<IActivitiesProviderProps> = ({
  initialState,
  children
}) => {
  const [state, dispatch] = useReducer(
    ActivitiesReducer,
    _.defaultTo(initialState, defaultState)
  );
  const value = { state, dispatch };
  return (
    <ActivitiesContext.Provider value={value}>
      {children}
    </ActivitiesContext.Provider>
  );
};

export const ActivitiesConsumer = ActivitiesContext.Consumer;

export default ActivitiesContext;
