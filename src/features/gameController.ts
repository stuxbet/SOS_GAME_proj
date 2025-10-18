import {
  type SosCell,
  type SosMark,
  type SosGameMode,
  createSosGame,
  type SosGame,
} from './models';

export type PlayerId = 'playerOne' | 'playerTwo';

export class GameController {
  private game: SosGame;
  private playerMarks: Record<PlayerId, SosMark>;
  private currentPlayer: PlayerId;
  private mode: SosGameMode;

  constructor(size = 3, mode: SosGameMode = 'simple') {
    this.mode = mode;
    this.game = createSosGame(mode, size);
    this.playerMarks = {playerOne: 'S', playerTwo: 'O'};
    this.currentPlayer = 'playerOne';
  }

  getState(): {
    board: SosCell[][];
    size: number;
    currentPlayer: PlayerId;
    playerMarks: Record<PlayerId, SosMark>;
    mode: SosGameMode;
  } {
    return {
      board: this.cloneBoard(),
      size: this.game.size,
      currentPlayer: this.currentPlayer,
      playerMarks: {...this.playerMarks},
      mode: this.mode,
    };
  }

  setPlayerMark(player: PlayerId, mark: SosMark) {
    this.playerMarks[player] = mark;
  }

  setMode(mode: SosGameMode) {
    if (this.mode !== mode) {
      this.mode = mode;
      this.game = createSosGame(this.mode, this.game.size);
      this.currentPlayer = 'playerOne';
    }
  }

  reset(size = this.game.size) {
    this.game = createSosGame(this.mode, size);
    this.currentPlayer = 'playerOne';
  }

  makeMove(row: number, col: number) {
    const mark = this.playerMarks[this.currentPlayer];
    this.game.place(row, col, mark);
    this.currentPlayer = this.currentPlayer === 'playerOne' ? 'playerTwo' : 'playerOne';
  }

  private cloneBoard(): SosCell[][] {
    return this.game.board.map((row) => [...row]);
  }
}
