/* eslint-disable @typescript-eslint/no-unused-vars */
import appEnv from 'app/app.env';
import { storage } from 'app/app.storage';
import { STATUS_CODE } from 'app/app.status';
import { refreshAccessToken } from 'api/request.api';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { appRouteConstants } from 'app/app-route.constant';
import { withError, withData, wait } from 'common/common-helper';

import { urls } from './api.url';

const MAX_TRIES = 10;
const currentRetries: Record<string, number> = {};

const axiosInstance = axios.create({
  baseURL: appEnv.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing: boolean = false;

let refreshSubscribers: (() => void)[] = [];

const subscribeTokenRefresh = (cb: any) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.map((cb: (token: string) => void) => cb(token));
};

axiosInstance.interceptors.response.use(
  (response: AxiosResponse): any => {
    const config = response.config;
    const url = config.url;
    const status = response.status;

    const retry = async () => {
      await wait(10000);

      return axiosInstance(config);
    };

    if (urls.auth.ACCOUNT_REFRESH === url && STATUS_CODE.SERVER_ACCEPTED === status) {
      currentRetries[url] = currentRetries[url] ? currentRetries[url] + 1 : 1;
      if (currentRetries[url] <= MAX_TRIES) {
        return retry();
      }

      return withError({
        message: 'Still getting 202',
        code: STATUS_CODE.SERVER_ACCEPTED,
      });
    }

    return withData(response.data);
  },
  (error: AxiosError): any => {
    if (error.message === STATUS_CODE.NETWORK_ERROR) {
      return withError(error.message);
    }

    const status = error.response?.status;
    const url = error.response?.config?.url;
    const isAuthenticating = url === urls.auth.LOGIN_IN || url === urls.auth.REGISTER || url === urls.auth.PROFILE;

    const errorResponse = error.response?.data ? error.response.data : error;

    /**
     * IF the request is Account refresh and the server response is 500
     * It will try for 4 times to get the response 200
     * If not it will return the error response
     */

    if (urls.auth.ACCOUNT_REFRESH === url && STATUS_CODE.SERVER_ERROR === status) {
      currentRetries[url] = currentRetries[url] ? currentRetries[url] + 1 : 1;
      if (currentRetries[url] > MAX_TRIES) {
        return withError(errorResponse);
      }

      return axiosInstance(error.config);
    }

    if (status === STATUS_CODE.UNAUTHORIZED && !isAuthenticating) {
      storage.clear();
      window.location.replace(`${appRouteConstants.auth.LOGIN}?expired=true`);

      return withError(errorResponse);
    }

    return withError(errorResponse);
  }
);

const handle401Error = async (error: any) => {
  const pendingRequest = error.config;

  if (!isRefreshing) {
    isRefreshing = true;

    const existingToken = storage.accessToken() || '';

    refreshAccessToken({ referenceToken: existingToken }).then((res: any) => {
      if (res.data) {
        const { data } = res;
        isRefreshing = false;
        onRefreshed(data.token);
        storage.changeAccessToken(data.token);
        return (refreshSubscribers = []);
      }
    });
  }

  const retryPendingRequest = new Promise((resolve) => {
    subscribeTokenRefresh((token: string) => {
      // replace the expired token and retry
      pendingRequest.headers.authorization = `Bearer ${token}`;
      resolve(axiosInstance(pendingRequest));
    });
  });

  return retryPendingRequest;
};

export function get<P>(url: string, params?: P): any {
  return axiosInstance({
    method: 'get',
    url,
    params,
    headers: {
      authorization: `Bearer ${storage.accessToken()}`,
    },
  });
}

export function post(url: string, data: any, auth: boolean = true, params?: any): any {
  return axiosInstance({
    method: 'post',
    url,
    data,
    params,
    headers: auth
      ? {
          authorization: `Bearer ${storage.accessToken()}`,
        }
      : undefined,
  });
}

export function put(url: string, data: any): any {
  return axiosInstance({
    method: 'put',
    url,
    data,
    headers: {
      authorization: `Bearer ${storage.accessToken()} `,
    },
  });
}
export function patch(url: string, data?: any): any {
  return axiosInstance({
    method: 'patch',
    url,
    data,
    headers: {
      authorization: `Bearer ${storage.accessToken()} `,
    },
  });
}

export function remove(url: string, params: object = {}): any {
  return axiosInstance({
    method: 'delete',
    url,
    params,
    headers: {
      authorization: `Bearer ${storage.accessToken()} `,
    },
  });
}
