export interface IActivity {
  accessibility: number;
  activity: string;
  key: string;
  link: string;
  participants: number;
  price: number;
  type: string;
}

export interface IActivitiesState {
  activities: IActivity[];
}

export interface IActivitiesAction {
  type: string;
  payload?: IActivity | IActivity[] | string | number | undefined;
}

export interface IActivitiesContext {
  state: IActivitiesState;
  dispatch: React.Dispatch<IActivitiesAction>;
}

export interface IActivitiesProviderProps {
  initialState?: IActivitiesState;
}

export interface IActivityParams {
  minaccessibility?: number;
  maxaccessibility?: number;
  minprice?: number;
  maxprice?: number;
  participants?: number;
  type?: string;
  key?: string;
}
