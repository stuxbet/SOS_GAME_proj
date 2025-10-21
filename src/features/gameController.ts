import {
  type SosCell,
  type SosMark,
  type SosGameMode,
  type PlayerId,
  type WinnerId,
  type Scores,
  createSosGame,
  type SosGame,
  type MoveOutcome,
} from './models';

export class GameController {
  private static readonly MIN_SIZE = 3;
  private static readonly MAX_SIZE = 10;
  private game: SosGame;
  private playerMarks: Record<PlayerId, SosMark>;
  private currentPlayer: PlayerId;
  private mode: SosGameMode;
  private winner: WinnerId;
  private scores: Scores;
  private hasStarted: boolean;

  constructor(size = 3, mode: SosGameMode = 'simple') {
    this.mode = mode;
    const clampedSize = this.clampSize(size);
    this.game = createSosGame(mode, clampedSize);
    this.playerMarks = {playerOne: 'S', playerTwo: 'O'};
    this.currentPlayer = 'playerOne';
    this.scores = {playerOne: 0, playerTwo: 0};
    this.winner = null;
    this.hasStarted = false;
  }

  getState(): {
    board: SosCell[][];
    size: number;
    currentPlayer: PlayerId;
    playerMarks: Record<PlayerId, SosMark>;
    mode: SosGameMode;
    winner: WinnerId;
    scores: Scores;
  } {
    return {
      board: this.cloneBoard(),
      size: this.game.size,
      currentPlayer: this.currentPlayer,
      playerMarks: {...this.playerMarks},
      mode: this.mode,
      winner: this.winner,
      scores: {...this.scores},
    };
  }

  setPlayerMark(player: PlayerId, mark: SosMark) {
    this.playerMarks[player] = mark;
  }

  setMode(mode: SosGameMode) {
    if (this.mode !== mode && !this.hasStarted) {
      this.mode = mode;
      this.game = createSosGame(this.mode, this.game.size);
      this.currentPlayer = 'playerOne';
      this.scores = {playerOne: 0, playerTwo: 0};
      this.winner = null;
    }
  }

  reset(size = this.game.size) {
    const clampedSize = this.clampSize(size);
    this.game = createSosGame(this.mode, clampedSize);
    this.currentPlayer = 'playerOne';
    this.scores = {playerOne: 0, playerTwo: 0};
    this.winner = null;
    this.hasStarted = false;
  }

  makeMove(row: number, col: number) {
    if (this.winner) {
      return;
    }
    const activePlayer = this.currentPlayer;
    const mark = this.playerMarks[this.currentPlayer];
    const outcome: MoveOutcome = this.game.playMove(row, col, mark, activePlayer);

    this.hasStarted = true;
    this.scores = {...outcome.scores};

    if (outcome.winner !== null) {
      this.winner = outcome.winner;
    }

    if (!outcome.extraTurn && this.winner === null) {
      this.currentPlayer = this.togglePlayer(activePlayer);
    }
  }

  private cloneBoard(): SosCell[][] {
    return this.game.board.map((row) => [...row]);
  }

  private togglePlayer(player: PlayerId): PlayerId {
    return player === 'playerOne' ? 'playerTwo' : 'playerOne';
  }

  private clampSize(value: number): number {
    const {MIN_SIZE, MAX_SIZE} = GameController;
    if (!Number.isFinite(value)) {
      return MIN_SIZE;
    }
    const rounded = Math.round(value);
    if (rounded < MIN_SIZE) {
      return MIN_SIZE;
    }
    if (rounded > MAX_SIZE) {
      return MAX_SIZE;
    }
    return rounded;
  }
}
