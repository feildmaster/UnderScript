import { restoreFetch } from './fetch.js';

afterEach(() => {
  localStorage.clear();
  restoreFetch();
});
