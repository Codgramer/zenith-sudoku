import * as React from "react";
import GameSelect from "./Game/GameSelect";
import {Container} from "src/components/Layout";
import Button from "../components/Button";
import {useNavigate} from "@tanstack/react-router";
import {DarkModeButton} from "src/components/DarkModeButton";

const SelectGame = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate({
      to: "/",
    });
  };

  return (
    <Container className="p-4 sm:p-6 md:p-8 mt-4 bg-surface-secondary rounded-lg shadow-xl dark:bg-surface-dark-secondary">
      <div className="mb-8 flex flex-col gap-4 border-b-2 border-primary-light pb-4">
        <div className="flex gap-4 items-center justify-between">
          <h1 className="text-3xl font-bold text-text-primary dark:text-white">{"Select a Sudoku"}</h1>
          <div className="flex gap-2">
            <DarkModeButton />
            <Button
              className="bg-primary-accent text-white flex-shrink-0 hover:bg-primary-dark"
              onClick={goBack}
            >
              {"◀ Back"}
            </Button>
          </div>
        </div>
        <p className="text-text-secondary dark:text-gray-300 text-lg">
          {"Select a new Sudoku to play or continue with an already started game."}
        </p>
      </div>
      <GameSelect />
    </Container>
  );
};

export default SelectGame;