import * as React from "react";
import Button from "../Button";
import clsx from "clsx";
import {CellCoordinates} from "src/lib/engine/types";

export const UndoButton: React.FC<{
  canUndo: boolean;
  undo: () => void;
}> = ({canUndo, undo}) => {
  return (
    <Button disabled={!canUndo} onClick={undo} className="bg-gray-500 text-white hover:bg-gray-600 transition-colors">
      {"Undo"}
    </Button>
  );
};

export const RedoButton: React.FC<{
  canRedo: boolean;
  redo: () => void;
}> = ({canRedo, redo}) => {
  return (
    <Button disabled={!canRedo} onClick={redo} className="bg-gray-500 text-white hover:bg-gray-600 transition-colors">
      {"Redo"}
    </Button>
  );
};

export const EraseButton: React.FC<{
  activeCellCoordinates: CellCoordinates | undefined;
  clearCell: (cellCoordinates: CellCoordinates) => void;
}> = ({activeCellCoordinates, clearCell}) => {
  return <Button onClick={() => activeCellCoordinates && clearCell(activeCellCoordinates)} className="bg-gray-500 text-white hover:bg-gray-600 transition-colors">{"Erase"}</Button>;
};

export const ClearAllNotesButton: React.FC<{
  clearAllNotes: () => void;
}> = ({clearAllNotes}) => {
  return <Button onClick={clearAllNotes} className="bg-gray-500 text-white hover:bg-gray-600 transition-colors">{"Clear All Notes"}</Button>;
};

const NotesButton: React.FC<{
  notesMode: boolean;
  activateNotesMode: () => void;
  deactivateNotesMode: () => void;
}> = ({notesMode, activateNotesMode, deactivateNotesMode}) => {
  return (
    <Button onClick={() => (notesMode ? deactivateNotesMode() : activateNotesMode())} className={"relative bg-gray-500 text-white hover:bg-gray-600 transition-colors"}>
      <div
        className={clsx("absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full px-2 text-sm md:text-base text-white transition-colors", {
          "bg-green-500": !notesMode,
          "bg-primary-accent": notesMode,
        })}
      >{`${notesMode ? "ON" : "OFF"}`}</div>
      <div>{"Notes"}</div>
    </Button>
  );
};

const HintButton: React.FC<{
  activeCellCoordinates: CellCoordinates | undefined;
  getHint: (cellCoordinates: CellCoordinates) => void;
}> = ({activeCellCoordinates, getHint}) => {
  return <Button onClick={() => activeCellCoordinates && getHint(activeCellCoordinates)} className="bg-gray-500 text-white hover:bg-gray-600 transition-colors">{"Hint"}</Button>;
};

const SudokuMenuControls: React.FC<{
  notesMode: boolean;
  activeCellCoordinates: CellCoordinates | undefined;
  clearCell: (cellCoordinates: CellCoordinates) => void;
  activateNotesMode: () => void;
  deactivateNotesMode: () => void;
  getHint: (cellCoordinates: CellCoordinates) => void;
  canUndo: boolean;
  undo: () => void;
  canRedo: boolean;
  redo: () => void;
  clearAllNotes: () => void;
}> = ({
  notesMode,
  activeCellCoordinates,
  clearCell,
  activateNotesMode,
  deactivateNotesMode,
  getHint,
  canUndo,
  undo,
  canRedo,
  redo,
  clearAllNotes,
}) => {
  return (
    <div className="grid w-full grid-cols-4 gap-2">
      <UndoButton canUndo={canUndo} undo={undo} />
      <RedoButton canRedo={canRedo} redo={redo} />
      <EraseButton activeCellCoordinates={activeCellCoordinates} clearCell={clearCell} />
      <NotesButton
        notesMode={notesMode}
        activateNotesMode={activateNotesMode}
        deactivateNotesMode={deactivateNotesMode}
      />
      <HintButton activeCellCoordinates={activeCellCoordinates} getHint={getHint} />
      <ClearAllNotesButton clearAllNotes={clearAllNotes} />
    </div>
  );
};

export default SudokuMenuControls;
