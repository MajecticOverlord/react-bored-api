import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import _ from "lodash";

const httpFactory = (params: AxiosRequestConfig) => {
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

    async request<T = any>(
      config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
      const response = await this.instance.request<T>(
        this.combineConfig(config)
      );
      return response;
    },

    async get<T = any>(
      url: string,
      config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
      const response = await this.instance.get<T>(
        url,
        this.combineConfig(config)
      );
      return response;
    },

    async delete<T = any>(
      url: string,
      config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
      const response = await this.instance.delete<T>(
        url,
        this.combineConfig(config)
      );
      return response;
    },

    async head<T = any>(
      url: string,
      config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
      const response = await this.instance.head<T>(
        url,
        this.combineConfig(config)
      );
      return response;
    },

    async post<T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
      const response = await this.instance.post<T>(
        url,
        data,
        this.combineConfig(config)
      );
      return response;
    },

    async put<T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
      const response = await this.instance.put<T>(
        url,
        data,
        this.combineConfig(config)
      );
      return response;
    },

    async patch<T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
      const response = await this.instance.patch<T>(
        url,
        data,
        this.combineConfig(config)
      );
      return response;
    }
  };
};
export default httpFactory;
