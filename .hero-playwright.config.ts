import config from './playwright.config';
export default { ...config, use: { ...config.use, baseURL: 'http://localhost:4321' }, webServer: undefined };
