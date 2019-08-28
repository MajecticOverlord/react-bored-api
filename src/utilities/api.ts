import { IActivity, IActivityParams } from "models/Activities";
import httpFactory from "./httpFactory";

export const http = httpFactory({
  baseURL: process.env.REACT_APP_BORED_API,
  timeout: 60000,
  withCredentials: false,
  headers: { "Content-Type": "application/json" },
  responseType: "json"
});

export const fetchActivity = (params?: IActivityParams): Promise<IActivity> => {
  return http
    .get<IActivity>("/api/activity", { params })
    .then(({ request }) => {
      let activity: IActivity = request.response;
      return activity;
    });
};

export default http;
