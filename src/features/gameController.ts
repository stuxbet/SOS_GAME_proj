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
  private winner: PlayerId | null;

  constructor(size = 3, mode: SosGameMode = 'simple') {
    this.mode = mode;
    this.game = createSosGame(mode, size);
    this.playerMarks = {playerOne: 'S', playerTwo: 'O'};
    this.currentPlayer = 'playerOne';
    this.winner = null;
  }

  getState(): {
    board: SosCell[][];
    size: number;
    currentPlayer: PlayerId;
    playerMarks: Record<PlayerId, SosMark>;
    mode: SosGameMode;
    winner: PlayerId | null;
  } {
    return {
      board: this.cloneBoard(),
      size: this.game.size,
      currentPlayer: this.currentPlayer,
      playerMarks: {...this.playerMarks},
      mode: this.mode,
      winner: this.winner,
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
      this.winner = null;
    }
  }

  reset(size = this.game.size) {
    this.game = createSosGame(this.mode, size);
    this.currentPlayer = 'playerOne';
    this.winner = null;
  }

  makeMove(row: number, col: number) {
    if (this.winner) {
      return;
    }
    const activePlayer = this.currentPlayer;
    const mark = this.playerMarks[this.currentPlayer];
    const sosFormed = this.game.place(row, col, mark);
    if (sosFormed && this.mode === 'simple') {
      this.winner = activePlayer;
    }
    this.currentPlayer = activePlayer === 'playerOne' ? 'playerTwo' : 'playerOne';
  }

  private cloneBoard(): SosCell[][] {
    return this.game.board.map((row) => [...row]);
  }
}
