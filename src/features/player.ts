import type { PlayerId, SosMark, SosMove, SosGame } from "./models";

export type PlayerSnapshot = {
  id: PlayerId;
  isComputer: boolean;
  mark: SosMark;
  score: number;
};

export abstract class BasePlayer {
  protected readonly id: PlayerId;
  protected mark: SosMark;

  constructor(id: PlayerId, mark: SosMark) {
    this.id = id;
    this.mark = mark;
  }

  getMark(): SosMark {
    return this.mark;
  }

  setMark(mark: SosMark) {
    this.mark = mark;
  }

  abstract isComputer(): boolean;

  takeTurn(_game: SosGame): SosMove | null {
    return null;
  }

  toSnapshot(score: number): PlayerSnapshot {
    return {
      id: this.id,
      isComputer: this.isComputer(),
      mark: this.mark,
      score,
    };
  }
}

export class HumanPlayer extends BasePlayer {
  isComputer(): boolean {
    return false;
  }
}

export interface Algo {
  chooseMove(game: SosGame, player: BasePlayer): SosMove | null;
}

class FirstOpenCell implements Algo {
  chooseMove(game: SosGame): SosMove | null {
    for (let row = 0; row < game.size; row += 1) {
      for (let col = 0; col < game.size; col += 1) {
        if (game.board[row][col] === null) {
          return { row, col };
        }
      }
    }
    return null;
  }
}

export class ComputerPlayer extends BasePlayer {
  private algo: Algo;

  constructor(id: PlayerId, mark: SosMark, algo: Algo = new FirstOpenCell()) {
    super(id, mark);
    this.algo = algo;
  }

  isComputer(): boolean {
    return true;
  }

  setStrategy(algo: Algo) {
    this.algo = algo;
  }

  override takeTurn(game: SosGame): SosMove | null {
    return this.algo.chooseMove(game, this);
  }
}
