type EnvType = {
  [key: string]: string | undefined;
};

const getEnv = (): EnvType => {
  if (typeof window !== "undefined" && (window as any)._env_) {
    return (window as any)._env_;
  }

  if (typeof import.meta !== "undefined" && import.meta.env) {
    return import.meta.env as EnvType;
  }

  if (typeof process !== "undefined" && process.env) {
    return process.env;
  }

  return {};
};

export const env = getEnv();
