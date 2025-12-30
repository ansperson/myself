let parentConfig = {};
try {
  parentConfig = window.parent?.__SYSTEM_CONFIG__ || {};
} catch (error) {
  parentConfig = {};
}
const config = window.__SYSTEM_CONFIG__ || parentConfig || {};

export const SYSTEM_USER = config.username || "demo";
export const SYSTEM_HOME = `/home/${SYSTEM_USER}`;
