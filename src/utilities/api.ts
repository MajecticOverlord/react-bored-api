import { IActivity, IActivityParams } from "models/Activities";
import httpFactory from "./httpFactory";
import _ from "lodash";

export const http = httpFactory({
  baseURL: process.env.REACT_APP_BORED_API,
  timeout: 60000,
  withCredentials: false,
  headers: { "Content-Type": "application/json" },
  responseType: "json"
});

export const fetchActivity = (
  params?: Partial<IActivityParams>
): Promise<IActivity> => {
  return http
    .get<IActivity>("/api/activity", { params })
    .then(({ request }) => {
      let activity: IActivity = request.response;
      return activity;
    });
};

export const fetchActivities = (keys: string[]): Promise<IActivity[]> => {
  return Promise.all<IActivity>(
    _.map(keys, (key: string) => {
      return Promise.resolve(fetchActivity({ key }));
    })
  ).then((activities: IActivity[]) => {
    return activities;
  });
};

export default http;
