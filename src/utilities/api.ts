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
): Promise<IActivity | Error> => {
  return http
    .get<IActivity>("/api/activity", { params })
    .then<IActivity>(({ request }) => {
      const hasError = _.has(request.response, "error");
      if (hasError) {
        let error: string = _.get(request.response, "error", null);
        throw new Error(error);
      }

      let activity: IActivity = request.response;
      return activity;
    })
    .catch<Error>((error: Error) => {
      console.warn(error);
      throw error;
    });
};

export const fetchActivities = (keys: string[]): Promise<IActivity[] | any> => {
  return Promise.all<IActivity | any>(
    _.map(keys, (key: string) => {
      return Promise.resolve(fetchActivity({ key }));
    })
  ).then((activities: IActivity[]) => {
    return activities;
  });
};

export default http;
