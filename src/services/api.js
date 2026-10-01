/** Simulates network latency so the UI exercises real loading states. */
export const delay = (ms = 350) => new Promise((res) => setTimeout(res, ms));

export const clone = (data) => JSON.parse(JSON.stringify(data));

export const ok = async (data, ms) => {
  await delay(ms);
  return clone(data);
};