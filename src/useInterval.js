import { useEffect, useRef } from "react";

// PURPOSE OF THIS CLASS:

// ****THIS IS WRONG****
// useEffect(() => {
//   const interval = setInterval(()=>{setSeconds(seconds + 1)}, 10);
//   return () => {
//     clearInterval(interval);
//   };
// }, []);

//The above does not work because "seconds" is only absorbed from scope exactly once- on the initial useEffect render.
// Thus "seconds" will always be 0 and seconds + 1 is set to 1 every refresh. We need a way to keep that value updated within this scope.

function useInterval(callback, delay) {
  // useRef is a sort of class state - we save the most recent *callback* in it-
  // this *callback* contains the updated state from the last refresh in it.
  const savedCallback = useRef();

  // update the callback on every refresh- updating the state that the callback absorbs from scope.
  useEffect(() => {
    savedCallback.current = callback;
  });

  // on  tick, call the saved/updated callback containing the updated state.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    let id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}

export { useInterval };
