import {
  IActivity,
  IActivitiesState,
  IActivitiesAction,
  IActivitiesContext,
  IActivitiesProviderProps
} from "models/Activities";
import _ from "lodash";

const STORAGE_KEY = "activities";

export const setActivities = (activities: IActivity[]): void =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));

export const removeActivities = (): void => setActivities([]);

export const getActivities = (): IActivity[] => {
  return localStorage.getItem(STORAGE_KEY)
    ? JSON.parse(_.toString(localStorage.getItem(STORAGE_KEY)))
    : [];
};

export const setActivity = (activity: IActivity): void => {
  const activities = getActivities();
  if (!activities.includes(activity)) {
    setActivities([...activities, activity]);
  }
};

export const removeActivity = (activity: IActivity): void => {
  const activities = getActivities();
  setActivities(
    _.filter(activities, _activity => _activity.key !== activity.key)
  );
};
