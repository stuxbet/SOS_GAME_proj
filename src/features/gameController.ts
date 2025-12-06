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
} from "./models";
import {
  BasePlayer,
  ComputerPlayer,
  HumanPlayer,
  type PlayerSnapshot,
} from "./player";

export class GameController {
  private static readonly MIN_SIZE = 3;
  private static readonly MAX_SIZE = 10;
  private game: SosGame;
  private players: Record<PlayerId, BasePlayer>;
  private currentPlayer: PlayerId;
  private mode: SosGameMode;
  private winner: WinnerId;
  private scores: Scores;
  private hasStarted: boolean;

  constructor(size = 3, mode: SosGameMode = "simple") {
    this.mode = mode;
    const clampedSize = this.clampSize(size);
    this.game = createSosGame(mode, clampedSize);
    this.players = {
      playerOne: new HumanPlayer("playerOne", "S"),
      playerTwo: new HumanPlayer("playerTwo", "O"),
    };
    this.currentPlayer = "playerOne";
    this.scores = { playerOne: 0, playerTwo: 0 };
    this.winner = null;
    this.hasStarted = false;
  }

  getState(): {
    board: SosCell[][];
    size: number;
    currentPlayer: PlayerId;
    players: Record<PlayerId, PlayerSnapshot>;
    mode: SosGameMode;
    winner: WinnerId;
    scores: Scores;
    hasStarted: boolean;
  } {
    return {
      board: this.cloneBoard(),
      size: this.game.size,
      currentPlayer: this.currentPlayer,
      players: this.snapshotPlayers(),
      mode: this.mode,
      winner: this.winner,
      scores: { ...this.scores },
      hasStarted: this.hasStarted,
    };
  }

  setPlayerMark(player: PlayerId, mark: SosMark) {
    this.players[player].setMark(mark);
  }

  setPlayerComputer(player: PlayerId, isComputer: boolean) {
    if (this.hasStarted) {
      return;
    }
    const current = this.players[player];
    if (current.isComputer() === isComputer) {
      return;
    }
    this.players[player] = this.createPlayer(
      player,
      current.getMark(),
      isComputer
    );
  }

  setMode(mode: SosGameMode) {
    if (this.mode !== mode && !this.hasStarted) {
      this.mode = mode;
      this.game = createSosGame(this.mode, this.game.size);
      this.currentPlayer = "playerOne";
      this.scores = { playerOne: 0, playerTwo: 0 };
      this.winner = null;
    }
  }

  reset(size = this.game.size) {
    const clampedSize = this.clampSize(size);
    this.game = createSosGame(this.mode, clampedSize);
    this.currentPlayer = "playerOne";
    this.scores = { playerOne: 0, playerTwo: 0 };
    this.winner = null;
    this.hasStarted = false;
  }

  makeComputerMove(): boolean {
    if (this.winner) {
      return false;
    }

    let moved = false;
    while (!this.winner) {
      if (!this.players[this.currentPlayer].isComputer()) {
        break;
      }
      const move = this.game.getComputerMove();
      if (!move) {
        break;
      }
      this.makeMove(move.row, move.col);
      moved = true;
      if (!this.players[this.currentPlayer].isComputer()) {
        break;
      }
    }
    return moved;
  }

  makeMove(row: number, col: number) {
    if (this.winner) {
      return;
    }
    const activePlayer = this.currentPlayer;
    const mark = this.players[this.currentPlayer].getMark();
    const outcome: MoveOutcome = this.game.playMove(
      row,
      col,
      mark,
      activePlayer
    );

    this.hasStarted = true;
    this.scores = { ...outcome.scores };

    if (outcome.winner !== null) {
      this.winner = outcome.winner;
    }

    if (!outcome.extraTurn && this.winner === null) {
      this.currentPlayer = this.togglePlayer(activePlayer);
    }
  }

  private cloneBoard(): SosCell[][] {
    return this.game.board.map((row) =>
      row.map((cell) => (cell ? { ...cell } : null))
    );
  }

  private snapshotPlayers(): Record<PlayerId, PlayerSnapshot> {
    return {
      playerOne: this.players.playerOne.toSnapshot(this.scores.playerOne),
      playerTwo: this.players.playerTwo.toSnapshot(this.scores.playerTwo),
    };
  }

  private createPlayer(
    player: PlayerId,
    mark: SosMark,
    isComputer: boolean
  ): BasePlayer {
    return isComputer
      ? new ComputerPlayer(player, mark)
      : new HumanPlayer(player, mark);
  }

  private togglePlayer(player: PlayerId): PlayerId {
    return player === "playerOne" ? "playerTwo" : "playerOne";
  }

  private clampSize(value: number): number {
    const { MIN_SIZE, MAX_SIZE } = GameController;
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
