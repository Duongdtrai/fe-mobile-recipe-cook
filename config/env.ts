const ENVIRONMENT_CONFIG = {
  host: process.env.REACT_APP_HOST_API || "http://192.168.32.101:8080/api/v1",
  TIME_OUT: Number(process.env.REACT_APP_TIME_OUT) || 180000,
};

export default ENVIRONMENT_CONFIG;
