export type SosMark = 'S' | 'O';
export type SosCell = SosMark | null;

export class SosGame {
  board: SosCell[][];
  constructor(public size = 3) {
    this.board = this.makeBoard(size);
  }
  private makeBoard(size: number) {
    return Array.from({length: size}, () => Array<SosCell>(size).fill(null));
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
  }
}
