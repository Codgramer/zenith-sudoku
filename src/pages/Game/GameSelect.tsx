import * as React from "react";
import {useState} from "react";
import {useNavigate} from "@tanstack/react-router";
import {Collection} from "src/lib/database/collections";
import {localStoragePlayedSudokuRepository, StoredPlayedSudokuState} from "src/lib/database/playedSudokus";
import {getSudokusPaginated, SudokuRaw, useSudokuCollections} from "src/lib/game/sudokus";
import {SimpleSudoku} from "src/lib/engine/types";
import {stringifySudoku} from "src/lib/engine/utility";
import {formatDuration} from "src/utils/format";
import {useElementWidth} from "src/utils/hooks";
import Button from "src/components/Button";
import SudokuPreview from "../../components/sudoku/SudokuPreview"; // Corrected to default import
import NewSudoku from "./NewSudoku"; // Corrected relative path

const usePaginatedSudokus = (collection: Collection, page: number, pageSize: number) => {
  return getSudokusPaginated(collection, page, pageSize);
};

interface SudokuPreviewProps {
  size: number;
  onClick: () => void;
  id: number;
  sudoku: SimpleSudoku;
  darken: boolean;
}

const TabItem = ({active, children, ...props}: React.ButtonHTMLAttributes<HTMLButtonElement> & {active: boolean}) => (
  <button
    className={`px-1 xs:px-2 sm:px-4 text-xs sm:text-sm md:text-base py-2 pointer capitalize rounded-sm border-none transition-colors ${
      active
        ? "bg-primary text-white dark:bg-primary-accent"
        : "bg-transparent text-text-secondary dark:text-gray-300 hover:bg-surface-secondary dark:hover:bg-gray-800"
    }`}
    {...props}
  >
    {children}
  </button>
);

const PageSelector = ({
  page,
  pageCount,
  setPage,
}: {
  page: number;
  pageCount: number;
  setPage: (page: number) => void;
}) => {
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const current = page + 1;

    pages.push(1);

    if (current > 4) {
      pages.push("...");
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(pageCount - 1, current + 1);

    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== pageCount) {
        pages.push(i);
      }
    }

    if (current < pageCount - 3) {
      pages.push("...");
    }

    if (pageCount > 1) {
      pages.push(pageCount);
    }

    return pages;
  };

  return (
    <div className="flex justify-center items-center space-x-2 py-4">
      <Button onClick={() => setPage(page - 1)} disabled={page === 0}>
        {"‹"}
      </Button>

      {getVisiblePages().map((pageNum, index) => (
        <React.Fragment key={index}>
          {pageNum === "..." ? (
            <span className="px-2 text-text-secondary">...</span>
          ) : (
            <Button
              onClick={() => setPage((pageNum as number) - 1)}
              className={`transition-colors ${pageNum === page + 1 ? "bg-primary text-white dark:bg-primary-accent" : "bg-transparent text-text-secondary dark:text-gray-300"}`}
            >
              {pageNum}
            </Button>
          )}
        </React.Fragment>
      ))}

      <Button onClick={() => setPage(page + 1)} disabled={page === pageCount - 1}>
        {"›"}
      </Button>
    </div>
  );
};

const SudokuToSelect: React.FC<{
  sudoku: SudokuRaw;
  index: number;
  sudokuCollectionName: string;
  storedSudoku: StoredPlayedSudokuState | undefined;
}> = ({sudoku, index, sudokuCollectionName, storedSudoku}) => {
  const localSudoku = storedSudoku;
  const unfinished = localSudoku && !localSudoku.game.won;
  const finished = localSudoku && localSudoku.game.won;
  const navigate = useNavigate();

  const choose = () => {
    if (finished) {
      const areYouSure = confirm(
        "Are you sure? This will restart the sudoku and reset the timer. It will continue to say that you solved it.",
      );
      if (!areYouSure) {
        return;
      }
    }
    navigate({
      to: "/",
      search: {
        sudokuIndex: index + 1,
        sudoku: stringifySudoku(sudoku.sudoku),
        sudokuCollectionName: sudokuCollectionName,
      },
    });
  };

  const sudokuContainerRef = React.useRef<HTMLDivElement>(null);
  const size = useElementWidth(sudokuContainerRef);

  return (
    <div className="relative" ref={sudokuContainerRef}>
      {unfinished || finished ? (
        <div className="pointer-events-none absolute left-2 rounded-sm bottom-2 z-10 max-w-min bg-surface px-2 py-1 text-xs text-text-primary dark:text-white md:text-base">
          <div>
            <div className="whitespace-nowrap">{`${
              unfinished ? "Playing" : "Last"
            } time: ${formatDuration(localSudoku.game.secondsPlayed)}`}</div>
            {localSudoku.game.previousTimes.length > 0 && (
              <div className="whitespace-nowrap">{`Best time: ${formatDuration(
                Math.min(...localSudoku.game.previousTimes),
              )}`}</div>
            )}
            {localSudoku.game.timesSolved > 0 && (
              <div>{`Solved ${localSudoku.game.timesSolved} ${localSudoku.game.timesSolved === 1 ? "time" : "times"}`}</div>
            )}
            {unfinished && <div>{"Continue"}</div>}
            {finished && <div>{`Restart?`}</div>}
          </div>
        </div>
      ) : null}
      {size === undefined && (
        <div className="inline-block relative w-full">
          <div style={{marginTop: "100%"}} />
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="w-full h-full bg-surface-secondary dark:bg-gray-900 rounded-sm" />
          </div>
        </div>
      )}
      {size !== undefined && (
        <SudokuPreview
          size={size}
          onClick={choose}
          id={index + 1}
          sudoku={finished ? sudoku.solution : sudoku.sudoku}
          darken
        />
      )}
    </div>
  );
};

const GameIndex = ({
  pageSudokus,
  pageStart,
  sudokuCollectionName,
}: {
  pageSudokus: SudokuRaw[];
  pageStart: number;
  sudokuCollectionName: string;
}) => {
  if (pageSudokus.length === 0) {
    return (
      <div className="text-center text-text-secondary">
        There are no sudokus in this collection. Add one by clicking the "Add sudoku" button.
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
        {pageSudokus.map((sudoku, index) => {
          const globalIndex = pageStart + index;
          const sudokuKey = stringifySudoku(sudoku.sudoku);
          const storedSudoku = localStoragePlayedSudokuRepository.getSudokuState(sudokuKey);

          return (
            <SudokuToSelect
              key={globalIndex}
              sudoku={sudoku}
              index={globalIndex}
              sudokuCollectionName={sudokuCollectionName}
              storedSudoku={storedSudoku}
            />
          );
        })}
      </div>
    </div>
  );
};

const GameSelect: React.FC = () => {
  const {
    activeCollection,
    setActiveCollectionId,
    collections,
    addCollection,
    isBaseCollection,
    addSudokuToCollection,
    removeCollection,
  } = useSudokuCollections();
  const [page, setPage] = useState(0);

  const pageSize = 12;
  const {sudokus: pageSudokus, totalPages: pageCount} = usePaginatedSudokus(activeCollection, page, pageSize);
  const pageStart = page * pageSize;

  const setActiveCollectionAndResetPage = (collection: string) => {
    setActiveCollectionId(collection);
    setShowNewSudokuComponent(false);
    setPage(0);
  };

  const saveSudoku = async (sudoku: SimpleSudoku) => {
    addSudokuToCollection(activeCollection.id, sudoku);
    // TODO: add a toast notification
    setShowNewSudokuComponent(false);
  };

  const [showNewSudokuComponent, setShowNewSudokuComponent] = useState(false);
  const removeCollectionLocal = () => {
    if (isBaseCollectionLocal) {
      alert("You cannot delete the base collection.");
      return;
    }
    const areYouSure = confirm(
      `Are you sure you want to delete collection "${activeCollection.name}"? This will delete all sudokus in it.`,
    );
    if (!areYouSure) {
      return;
    }
    removeCollection(activeCollection.id);
    setActiveCollectionId(collections[0].id);
    setPage(0);
  };

  const isBaseCollectionLocal = isBaseCollection(activeCollection.id);

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex flex-wrap gap-2">
          {collections.map((collection) => (
            <TabItem
              key={collection.id}
              active={activeCollection.id === collection.id}
              onClick={() => setActiveCollectionAndResetPage(collection.id)}
            >
              {collection.name}
            </TabItem>
          ))}
          <TabItem
            active={false}
            onClick={() => {
              const newCollectionName = prompt("Enter the name of the new sudoku collection:");
              if (newCollectionName) {
                const newCollection = addCollection(newCollectionName);
                setActiveCollectionId(newCollection.id);
                setPage(0);
              }
            }}
          >
            + New Collection
          </TabItem>
        </div>
      </div>
      {!isBaseCollectionLocal && (
        <div className="flex justify-between items-center gap-2 mb-4">
          {!showNewSudokuComponent ? (
            <Button
              className="bg-primary text-white hover:bg-primary-dark"
              onClick={() => setShowNewSudokuComponent(true)}
            >
              {"Add sudoku +"}
            </Button>
          ) : (
            <Button onClick={() => setShowNewSudokuComponent(false)}>{"Close new sudoku creator"}</Button>
          )}
          <Button
            onClick={removeCollectionLocal}
            className="bg-danger text-white hover:bg-danger-dark transition-colors"
          >
            {"Delete collection"}
          </Button>
        </div>
      )}
      {!isBaseCollectionLocal && showNewSudokuComponent && (
        <div className="mb-4 p-4 bg-surface-secondary dark:bg-gray-900 rounded-sm shadow-md flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="text-text-primary dark:text-white text-lg sm:text-2xl font-bold">
              Create new sudoku
            </div>
            <Button onClick={() => setShowNewSudokuComponent(false)}>{"Close"}</Button>
          </div>
          <p className="text-text-secondary dark:text-white">{`Add your own sudoku. Set the numbers and you can play it. This sudoku will be added to the "${activeCollection.name}" collection.`}</p>
          <NewSudoku saveSudoku={saveSudoku} />
        </div>
      )}
      <GameIndex pageSudokus={pageSudokus} pageStart={pageStart} sudokuCollectionName={activeCollection.name} />
      {pageCount > 1 && <PageSelector page={page} pageCount={pageCount} setPage={setPage} />}
    </div>
  );
};

export default GameSelect;