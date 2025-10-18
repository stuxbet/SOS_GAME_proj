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

  place(row: number, col: number, mark: SosMark): boolean {
    if (!this.board[row] || col < 0 || col >= this.size || this.board[row][col]) {
      throw new Error('Invalid move');
    }
    this.board[row][col] = mark;
    return this.onMarkPlaced(row, col, mark);
  }

  protected abstract onMarkPlaced(row: number, col: number, mark: SosMark): boolean;

  private makeBoard(size: number) {
    return Array.from({length: size}, () => Array<SosCell>(size).fill(null));
  }
}

export class SimpleSosGame extends BaseSosGame {
  protected onMarkPlaced(row: number, col: number, _mark: SosMark): boolean {
    const directions: Array<[number, number]> = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ];
    const inBounds = (r: number, c: number) => r >= 0 && r < this.size && c >= 0 && c < this.size;

    for (const [dr, dc] of directions) {
      // look at 3 space row in each direction around the new move
      for (let offset = -2; offset <= 0; offset += 1) {
        const positions = [
          [row + offset * dr, col + offset * dc],
          [row + (offset + 1) * dr, col + (offset + 1) * dc],
          [row + (offset + 2) * dr, col + (offset + 2) * dc],
        ];
        // Skip window that are off board
        if (!positions.every(([r, c]) => inBounds(r, c))) {
          continue;
        }
        // this is what checks 
        const [first, middle, last] = positions.map(([r, c]) => this.board[r][c]);
        if (first === 'S' && middle === 'O' && last === 'S') {
          return true;
        }
      }
    }

    return false;
  }
}

export class GeneralSosGame extends BaseSosGame {
  protected onMarkPlaced(_row: number, _col: number, _mark: SosMark): boolean {
    return false;
  }
}

export type SosGame = BaseSosGame;

export const createSosGame = (mode: SosGameMode, size = 3): SosGame => {
  return mode === 'general' ? new GeneralSosGame(size) : new SimpleSosGame(size);
};
