import "./App.css";
import { useRef, useState } from "react";
import { useInterval } from "./useInterval";

// Defines a single block to be rendered. Could be it's own file.
const Block = (props) => {
  const { xPercent, yPercent, keyZone } = props;
  return (
    <div
      className="block"
      key={keyZone}
      style={{ left: `${xPercent}%`, top: `${yPercent}%` }}
    />
  );
};

// The main window containing the rain simulator
const RainZone = (props) => {
  const [blocks, setBlocks] = useState([]);           // Current blocks to render
  const [unusedKeys, setUnusedKeys] = useState([]);   // Block id keys that are available for reuse
  const keyIncr = useRef(0);                          // Reference for the largest key used

  const processTick = () => {
    //Update blocks via Y axis momentum. Capped at 100%.
    const blocksWithUpdatedLocation = blocks.map((block) => {
      return {
        ...block,
        yPercent:
          block.yPercent < 100
            ? block.yPercent + block.momentum <= 100
              ? block.yPercent + block.momentum
              : 100
            : block.yPercent,
        momentum: block.momentum * 1.005,
      };
    });

    // Delete finished blocks via omission
    // Create new block list, ignoring the blocks that have fully dropped
    var blocksAfterTick = [];
    var unusedKeysThisTick = unusedKeys;
    blocksWithUpdatedLocation.forEach((block) => {
      if (block.yPercent < 100) {
        blocksAfterTick.push(block);
      } else {
        unusedKeysThisTick.push(block.key);
      }
    });

    // Recycles an existing Block key if possible, or creates a new one.
    const provideKey = (incrementAmount) => {
      var newKey;
      if (unusedKeysThisTick.length === 0) {
        newKey = keyIncr.current + incrementAmount;
        console.log(`newKey: ${newKey}`)
      } else {
        newKey = unusedKeysThisTick.pop();
      }

      return newKey;
    };

    // Adds a new block to the array.
    const addNewBlock = (newKey) => {
      blocksAfterTick.push({
        key: newKey,
        xPercent: Math.random() * 99,
        yPercent: 0,
        momentum: 0.1 + Math.random() * 0.2,
      });
    };

    //Add blocks, up to three at once, randomly
    if (Math.random() > 0.2) {
      var localIncrement = 0;

      // Because the new key could either be new or re-used, we need to keep track of how many of the created keys are new to prevent duplicates.
      var newKeyCreated = provideKey(localIncrement + 1);
      if (newKeyCreated > keyIncr.current) { localIncrement += 1 };
      addNewBlock(newKeyCreated);

      if (Math.random() > 0.75) {
        newKeyCreated = provideKey(localIncrement + 1);
        if (newKeyCreated > keyIncr.current) { localIncrement += 1 };
        addNewBlock(newKeyCreated);

        if (Math.random() > 0.9) {
          newKeyCreated = provideKey(localIncrement + 1);
          if (newKeyCreated > keyIncr.current) { localIncrement += 1 };
          addNewBlock(newKeyCreated);
        }
      }

      keyIncr.current += localIncrement;
    }

    setUnusedKeys(unusedKeysThisTick);
    setBlocks(blocksAfterTick);
  };

  useInterval(processTick, 10);

  return (
    <>
      <div className="RainZone" key="rainzone" id="text">
        {blocks.map((block) => {
          return (
            <Block
              key={block.key}
              keyZone={block.key}
              xPercent={block.xPercent}
              yPercent={block.yPercent}
            />
          );
        })}

      </div>
      <br/>
      <div>
        Number of Block IDs Used: {keyIncr.current}
      </div>
    </>
  );
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <RainZone />
      </header>
    </div>
  );
}

export default App;
