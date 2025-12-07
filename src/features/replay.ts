import { GameController } from "./gameController";
import type { PlayerId, SosMark, SosGameMode, SosCell } from "./models";

type PlayerSettings = {
  mark: SosMark;
  isComputer: boolean;
};

export type ReplayHeader = {
  size: number;
  mode: SosGameMode;
  players: Record<PlayerId, PlayerSettings>;
};

export type RecordedMove = {
  row: number;
  col: number;
  player: PlayerId;
  mark: SosMark;
  turn: number;
};

export type ReplayPayload = {
  header: ReplayHeader;
  moves: RecordedMove[];
};

type GameStateSnapshot = ReturnType<GameController["getState"]>;

export const validateAndSortMoves = (moves: RecordedMove[]) => {
  const sorted = [...moves].sort((a, b) => a.turn - b.turn);
  sorted.forEach((move, index) => {
    if (move.turn <= 0 || !Number.isFinite(move.turn)) {
      throw new Error("Invalid turn number found in replay payload");
    }
    if (index === 0 && move.turn !== 1) {
      throw new Error("Turn numbers must start at 1");
    }
    if (index > 0 && move.turn !== sorted[index - 1].turn + 1) {
      throw new Error("Turns must be sequential with no gaps or duplicates");
    }
  });
  return sorted;
};

export const MovesFromBoard = (board: SosCell[][]): RecordedMove[] => {
  const moves: RecordedMove[] = [];

  board.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (cell) {
        moves.push({ row: r, col: c, ...cell });
      }
    });
  });

  return validateAndSortMoves(moves);
};

export const createControllerFromHeader = (header: ReplayHeader) => {
  const controller = new GameController(
    header.size,
    header.mode as SosGameMode
  );
  controller.setPlayerMark("playerOne", header.players.playerOne.mark);
  controller.setPlayerMark("playerTwo", header.players.playerTwo.mark);
  controller.setPlayerComputer(
    "playerOne",
    header.players.playerOne.isComputer
  );
  controller.setPlayerComputer(
    "playerTwo",
    header.players.playerTwo.isComputer
  );
  return controller;
};

export const makeReplayPayload = (state: GameStateSnapshot): ReplayPayload => ({
  header: {
    size: state.size,
    mode: state.mode,
    players: {
      playerOne: {
        mark: state.players.playerOne.mark,
        isComputer: state.players.playerOne.isComputer,
      },
      playerTwo: {
        mark: state.players.playerTwo.mark,
        isComputer: state.players.playerTwo.isComputer,
      },
    },
  },
  moves: MovesFromBoard(state.board),
});

export const serializeForDownload = (state: GameStateSnapshot) =>
  JSON.stringify(makeReplayPayload(state), null, 2);
