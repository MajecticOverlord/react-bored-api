import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import _ from "lodash";

// const http = httpFactory({
//   baseURL: process.env.BORED_API,
//   timeout: 60000,
//   withCredentials: true,
//   headers: { "Content-Type": "application/json" },
//   responseType: "json"
// });

export const httpFactory = (params: AxiosRequestConfig) => {
  const httpClient: AxiosInstance = axios.create(params);
  return {
    get instance(): AxiosInstance {
      return httpClient;
    },

    combineConfig(config?: AxiosRequestConfig): AxiosRequestConfig {
      const initialConfig = { headers: {} };
      config = _.isNil(config) ? initialConfig : _.merge(initialConfig, config);
      return config;
    },

    async request(config?: AxiosRequestConfig): Promise<AxiosResponse> {
      const response = await this.instance.request(this.combineConfig(config));
      return response;
    },

    async get(
      url: string,
      config?: AxiosRequestConfig
    ): Promise<AxiosResponse> {
      const response = await this.instance.get(url, this.combineConfig(config));
      return response;
    },

    async delete(
      url: string,
      config?: AxiosRequestConfig
    ): Promise<AxiosResponse> {
      const response = await this.instance.delete(
        url,
        this.combineConfig(config)
      );
      return response;
    },

    async head(
      url: string,
      config?: AxiosRequestConfig
    ): Promise<AxiosResponse> {
      const response = await this.instance.head(
        url,
        this.combineConfig(config)
      );
      return response;
    },

    async post(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
    ): Promise<AxiosResponse> {
      const response = await this.instance.post(
        url,
        data,
        this.combineConfig(config)
      );
      return response;
    },

    async put(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
    ): Promise<AxiosResponse> {
      const response = await this.instance.put(
        url,
        data,
        this.combineConfig(config)
      );
      return response;
    },

    async patch(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
    ): Promise<AxiosResponse> {
      const response = await this.instance.patch(
        url,
        data,
        this.combineConfig(config)
      );
      return response;
    }
  };
};
