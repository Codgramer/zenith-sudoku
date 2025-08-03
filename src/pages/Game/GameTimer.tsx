import * as React from "react";
import {useTimer} from "src/context/TimerContext";
import {formatDuration} from "src/utils/format";

const GameTimer: React.FC = () => {
  const {displayTime} = useTimer();

  return <div className="text-text-secondary dark:text-gray-400 font-mono">{formatDuration(displayTime)}</div>;
};

export default GameTimer;