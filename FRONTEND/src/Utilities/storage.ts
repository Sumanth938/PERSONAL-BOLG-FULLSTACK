export function setItem(key: string, value: any): void {
  console.log("wefagr");
  localStorage.setItem(key, JSON.stringify(value));
}

export function getItem(key: string): any {
  const value = localStorage.getItem(key) || undefined;
  if (value) {
    return JSON.parse(value) as any;
  }
  return null;
}

export function deleteItem(key: string) {
  localStorage.removeItem(key);
}

export function clear() {
  localStorage.clear();
}
