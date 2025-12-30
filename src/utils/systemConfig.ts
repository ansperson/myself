export type SystemConfig = {
  username: string;
};

const defaultConfig: SystemConfig = {
  username: 'demo'
};

export const systemConfig: SystemConfig = {
  ...defaultConfig,
  ...(window.__SYSTEM_CONFIG__ ?? {})
};

export const systemUser = systemConfig.username;
export const systemHome = `/home/${systemUser}`;
