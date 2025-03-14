export enum ApiVersion {
  V1 = 'v1',
  V2 = 'v2'
}

export const LATEST_VERSION = ApiVersion.V2;

export const isValidVersion = (version: string): version is ApiVersion => {
  return Object.values(ApiVersion).includes(version as ApiVersion);
}; 