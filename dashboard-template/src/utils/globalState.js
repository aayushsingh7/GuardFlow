// globalState.js
import { useState } from "react";

let globalValue;
let setGlobalValue;

export function useGlobalState() {
  const [value, setValue] = useState(globalValue);

  globalValue = value;
  setGlobalValue = setValue;

  return [value, setValue];
}

export function setGlobalState(value) {
  if (setGlobalValue) {
    setGlobalValue(value);
  }
}
