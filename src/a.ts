export const wait = (ms: number): Promise<string> =>
  new Promise((resolve, reject) => {
    if (ms < 0) {
      reject(new Error("Delay must be non-negative"));
      return;
    }
    setTimeout(() => resolve(`Waited ${ms}ms`), ms);
  });
