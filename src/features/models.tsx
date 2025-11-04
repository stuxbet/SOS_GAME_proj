export type SosMark = 'S' | 'O';
export type SosCell = SosMark | null;
export type SosGameMode = 'simple' | 'general';
export type PlayerId = 'playerOne' | 'playerTwo';
export type WinnerId = PlayerId | 'draw' | null;
export type Scores = Record<PlayerId, number>;

export type MoveOutcome = {
  sequences: number;
  extraTurn: boolean;
  winner: WinnerId;
  scores: Scores;
};

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

  playMove(row: number, col: number, mark: SosMark, player: PlayerId): MoveOutcome {
    if (!this.board[row] || col < 0 || col >= this.size || this.board[row][col]) {
      throw new Error('Invalid move');
    }
    this.board[row][col] = mark;
    const sequences = this.onMarkPlaced(row, col, mark);
    return this.resolveOutcome(player, sequences);
  }

  protected onMarkPlaced(_row: number, _col: number, _mark: SosMark): number {
    return 0;
  }

  protected abstract resolveOutcome(player: PlayerId, sequences: number): MoveOutcome;

  protected createEmptyScores(): Scores {
    return {playerOne: 0, playerTwo: 0};
  }

  protected isBoardFull(): boolean {
    return this.board.every((row) => row.every((cell) => cell !== null));
  }

  private makeBoard(size: number) {
    return Array.from({length: size}, () => Array<SosCell>(size).fill(null));
  }
}

export class SimpleSosGame extends BaseSosGame {
  protected onMarkPlaced(row: number, col: number, _mark: SosMark): number {
    const directions: Array<[number, number]> = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ];
    const inBounds = (r: number, c: number) => r >= 0 && r < this.size && c >= 0 && c < this.size;
    let matches = 0;

    for (const [dr, dc] of directions) {
      for (let offset = -2; offset <= 0; offset += 1) {
        const positions: Array<[number, number]> = [
          [row + offset * dr, col + offset * dc],
          [row + (offset + 1) * dr, col + (offset + 1) * dc],
          [row + (offset + 2) * dr, col + (offset + 2) * dc],
        ];
        if (!positions.every(([r, c]) => inBounds(r, c))) {
          continue;
        }
        const [first, middle, last] = positions.map(([r, c]) => this.board[r][c]);
        if (first === 'S' && middle === 'O' && last === 'S') {
          matches += 1;
        }
      }
    }

    return matches;
  }

  protected resolveOutcome(player: PlayerId, sequences: number): MoveOutcome {
    let winner: WinnerId = null;
    if (sequences > 0) {
      winner = player;
    } else if (this.isBoardFull()) {
      winner = 'draw';
    }
    return {
      sequences,
      extraTurn: false,
      winner,
      scores: this.createEmptyScores(),
    };
  }
}

export class GeneralSosGame extends BaseSosGame {
  private scores: Scores;

  constructor(size = 3) {
    super(size);
    this.scores = this.createEmptyScores();
  }

  reset(size = this.size) {
    super.reset(size);
    this.scores = this.createEmptyScores();
  }

  protected onMarkPlaced(row: number, col: number, _mark: SosMark): number {
    const directions: Array<[number, number]> = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ];
    const inBounds = (r: number, c: number) => r >= 0 && r < this.size && c >= 0 && c < this.size;
    let matches = 0;

    for (const [dr, dc] of directions) {
      for (let offset = -2; offset <= 0; offset += 1) {
        const positions: Array<[number, number]> = [
          [row + offset * dr, col + offset * dc],
          [row + (offset + 1) * dr, col + (offset + 1) * dc],
          [row + (offset + 2) * dr, col + (offset + 2) * dc],
        ];
        if (!positions.every(([r, c]) => inBounds(r, c))) {
          continue;
        }
        const [first, middle, last] = positions.map(([r, c]) => this.board[r][c]);
        if (first === 'S' && middle === 'O' && last === 'S') {
          matches += 1;
        }
      }
    }

    return matches;
  }

  protected resolveOutcome(player: PlayerId, sequences: number): MoveOutcome {
    if (sequences > 0) {
      this.scores[player] += sequences;
    }

    let winner: WinnerId = null;
    if (this.isBoardFull()) {
      const {playerOne, playerTwo} = this.scores;
      if (playerOne > playerTwo) {
        winner = 'playerOne';
      } else if (playerTwo > playerOne) {
        winner = 'playerTwo';
      } else {
        winner = 'draw';
      }
    }

    return {
      sequences,
      extraTurn: sequences > 0,
      winner,
      scores: {...this.scores},
    };
  }
}

export type SosGame = BaseSosGame;

export const createSosGame = (mode: SosGameMode, size = 3): SosGame => {
  return mode === 'general' ? new GeneralSosGame(size) : new SimpleSosGame(size);
};
