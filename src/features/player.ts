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

export class ComputerPlayer extends BasePlayer {
  isComputer(): boolean {
    return true;
  }

  override takeTurn(game: SosGame): SosMove | null {
    return game.getComputerMove();
  }
}
