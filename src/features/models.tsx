export type SosMark = 'S' | 'O';
export type SosCell = SosMark | null;
export type SosGameMode = 'simple' | 'general';

abstract class BaseSosGame {
  board: SosCell[][];
  size: number;

  constructor(size = 3) {
    this.size = size;
    this.board = this.makeBoard(size);
  }

  reset(size = this.size) {
    this.size = size;
    this.board = this.makeBoard(size);
  }

  place(row: number, col: number, mark: SosMark) {
    if (!this.board[row] || col < 0 || col >= this.size || this.board[row][col]) {
      throw new Error('Invalid move');
    }
    this.board[row][col] = mark;
    this.onMarkPlaced(row, col, mark);
  }

  protected abstract onMarkPlaced(row: number, col: number, mark: SosMark): void;

  private makeBoard(size: number) {
    return Array.from({length: size}, () => Array<SosCell>(size).fill(null));
  }
}

export class SimpleSosGame extends BaseSosGame {
  protected onMarkPlaced(): void {

  }
}

export class GeneralSosGame extends BaseSosGame {
  protected onMarkPlaced(): void {

  }
}

export type SosGame = BaseSosGame;

export const createSosGame = (mode: SosGameMode, size = 3): SosGame => {
  return mode === 'general' ? new GeneralSosGame(size) : new SimpleSosGame(size);
};

