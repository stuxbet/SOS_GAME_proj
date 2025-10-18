import {SosGame, type SosCell, type SosMark} from './models';

export type PlayerId = 'playerOne' | 'playerTwo';

export class GameController {
  private game: SosGame;
  private playerMarks: Record<PlayerId, SosMark>;
  private currentPlayer: PlayerId;

  constructor(size = 3) {
    this.game = new SosGame(size);
    this.playerMarks = {playerOne: 'S', playerTwo: 'O'};
    this.currentPlayer = 'playerOne';
  }

  getState(): {
    board: SosCell[][];
    size: number;
    currentPlayer: PlayerId;
    playerMarks: Record<PlayerId, SosMark>;
  } {
    return {
      board: this.cloneBoard(),
      size: this.game.size,
      currentPlayer: this.currentPlayer,
      playerMarks: {...this.playerMarks},
    };
  }

  setPlayerMark(player: PlayerId, mark: SosMark) {
    this.playerMarks[player] = mark;
  }

  reset(size = this.game.size) {
    this.game.reset(size);
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
