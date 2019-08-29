import {
  IActivity,
  IActivitiesState,
  IActivitiesAction,
  IActivitiesContext,
  IActivitiesProviderProps
} from "models/Activities";
import _ from "lodash";

const STORAGE_KEY = "activities_keys";

export const setActivitiesKeys = (keys: string[]): void =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));

export const removeActivitiesKeys = (): void => setActivitiesKeys([]);

export const getActivitiesKeys = (): string[] => {
  return localStorage.getItem(STORAGE_KEY)
    ? JSON.parse(_.toString(localStorage.getItem(STORAGE_KEY)))
    : [];
};

export const setActivityKey = (key: string): void => {
  const keys = getActivitiesKeys();
  if (!keys.includes(key)) {
    setActivitiesKeys([...keys, key]);
  }
};

export const removeActivityKey = (key: string): void => {
  const keys = getActivitiesKeys();
  setActivitiesKeys(_.filter(keys, _key => _key !== key));
};
