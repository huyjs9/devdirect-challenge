import { useMemo, useState } from 'react';

const isObject = (object) => {
  return object != null && typeof object === 'object';
};

const isDeepEqual = (object1, object2) => {
  const objKeys1 = Object.keys(object1);
  const objKeys2 = Object.keys(object2);

  if (objKeys1.length !== objKeys2.length) return false;

  for (var key of objKeys1) {
    const value1 = object1[key];
    const value2 = object2[key];

    const isObjects = isObject(value1) && isObject(value2);

    if (
      (isObjects && !isDeepEqual(value1, value2)) ||
      (!isObjects && value1 !== value2)
    ) {
      return false;
    }
  }
  return true;
};

export default function useHistoryState(init) {
  const [states, setStates] = useState([init]);
  const [index, setIndex] = useState(0);

  const state = useMemo(() => states[index], [states, index]);

  const setState = (value) => {
    if (isDeepEqual(state, value)) {
      return;
    }
    const copy = states.slice(0, index + 1);
    copy.push(value);
    setStates(copy);
    setIndex(copy.length - 1);
  };

  const resetState = (init) => {
    setIndex(0);
    setStates([init]);
  };

  const undo = (steps = 1) => {
    setIndex(Math.max(0, Number(index) - (Number(steps) || 1)));
  };

  const redo = (steps = 1) => {
    setIndex(Math.min(states.length - 1, Number(index) + (Number(steps) || 1)));
  };

  return {
    state,
    setState,
    resetState,
    index,
    lastIndex: states.length - 1,
    undo,
    redo,
  };
}
