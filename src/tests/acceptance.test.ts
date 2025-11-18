import { GameController } from "../features/gameController";

test("resetting with size 5 creates a 5x5 board", () => {
  const controller = new GameController(3);

  controller.reset(5);
  expect(controller.getState().board.length).toBe(5);
  expect(controller.getState().board.every((row) => row.length === 5)).toBe(
    true
  );
});

test("reset clamps size to range 3 to 10", () => {
  const controller = new GameController(3);

  controller.reset(2);
  expect(controller.getState().board.length).toBe(3);
  expect(controller.getState().board.every((row) => row.length === 3)).toBe(
    true
  );

  controller.reset(12);
  expect(controller.getState().board.length).toBe(10);
  expect(controller.getState().board.every((row) => row.length === 10)).toBe(
    true
  );
});

test("2.1", () => {
  const controller = new GameController(3);
  controller.setMode("general");

  expect(controller.getState().mode).toBe("general");
});

test("2.2", () => {
  const controller = new GameController(3);
  controller.makeMove(0, 0);
  controller.setMode("general");

  expect(controller.getState().mode).toBe("simple");
});

test("3.1", () => {
  const controller = new GameController(3, "general");

  controller.makeMove(0, 0);
  controller.makeMove(0, 1);
  controller.makeMove(0, 2);

  controller.reset(4);
  const state = controller.getState();

  expect(state.size).toBe(4);
  state.board.forEach((row) => row.forEach((cell) => expect(cell).toBeNull()));

  expect(state.scores.playerOne).toBe(0);
  expect(state.scores.playerTwo).toBe(0);
  expect(state.winner).toBeNull();
});

test("4.1", () => {
  const controller = new GameController(3);
  controller.makeMove(1, 1);
  const state = controller.getState();

  expect(state.board[1][1]).toBe("S");
});

test("4.2", () => {
  const controller = new GameController(3);
  controller.makeMove(0, 0);
  expect(() => controller.makeMove(0, 0)).toThrow("Invalid move");
});

test("4.3", () => {
  const controller = new GameController(3);

  controller.makeMove(0, 0);
  expect(controller.getState().currentPlayer).toBe("playerTwo");
  controller.makeMove(1, 1);
  expect(controller.getState().currentPlayer).toBe("playerOne");
});

test("5.1", () => {
  const controller = new GameController(3);
  controller.makeMove(0, 0);
  controller.makeMove(0, 1);
  controller.makeMove(0, 2);

  const state = controller.getState();
  expect(state.winner).toBe("playerOne");
});

test("5.2", () => {
  const controller = new GameController(3);
  controller.setPlayerMark("playerTwo", "S");

  const fillOrder: Array<[number, number]> = [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 0],
    [1, 1],
    [1, 2],
    [2, 0],
    [2, 1],
    [2, 2],
  ];

  fillOrder.forEach(([row, col]) => controller.makeMove(row, col));

  const state = controller.getState();
  expect(state.board.every((row) => row.every((cell) => cell !== null))).toBe(
    true
  );
  expect(state.winner).toBe("draw");
});

test("5.3", () => {
  const controller = new GameController(3);
  controller.makeMove(0, 0);
  controller.makeMove(0, 1);
  controller.makeMove(0, 2);
  controller.makeMove(1, 0);

  const state = controller.getState();
  expect(state.board[1][0]).toBeNull();
  expect(state.winner).toBe("playerOne");
});

test("6.1", () => {
  const controller = new GameController(3, "general");

  controller.makeMove(0, 0);
  controller.makeMove(0, 1);
  controller.makeMove(0, 2);

  const state = controller.getState();

  expect(state.scores.playerOne).toBe(1);
  expect(state.scores.playerTwo).toBe(0);
});

test("6.2", () => {
  const controller = new GameController(3, "general");

  controller.makeMove(0, 0);
  controller.makeMove(0, 1);
  controller.makeMove(0, 2);

  const state = controller.getState();

  expect(state.currentPlayer).toBe("playerOne");
  expect(state.scores.playerOne).toBeGreaterThan(0);
});

test("7.1", () => {
  const control = new GameController(3, "general");

  const move: Array<[number, number]> = [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 0],
    [1, 1],
    [1, 2],
    [2, 0],
    [2, 1],
    [2, 2],
  ];

  move.forEach(([row, col]) => control.makeMove(row, col));

  const state = control.getState();
  expect(state.board.every((row) => row.every((cell) => cell !== null))).toBe(
    true
  );
  expect(state.scores.playerOne).toBeGreaterThan(state.scores.playerTwo);
  expect(state.winner).toBe("playerOne");
});

test("8.1", () => {
  const controller = new GameController(3);
  controller.setPlayerComputer("playerTwo", true);

  controller.makeMove(0, 0);

  controller.makeComputerMove();
  const state = controller.getState();

  expect(state.board.flat().filter(Boolean).length).toBe(2);
});

test("8.2", () => {
  const controller = new GameController(3, "general");
  controller.setPlayerComputer("playerOne", true);
  controller.setPlayerMark("playerOne", "O");
  controller.setPlayerMark("playerTwo", "S");

  controller.makeMove(1, 0);
  controller.makeMove(0, 0);
  controller.makeMove(1, 2);
  controller.makeMove(0, 2);
  controller.makeMove(2, 0);
  controller.makeMove(2, 1);

  const scriptedRandomMove = [
    { row: 0, col: 1 },
    { row: 1, col: 1 },
  ];

  (controller as any).game.computerMovePicker = () =>
    scriptedRandomMove.shift() ?? null;

  const moved = controller.makeComputerMove();
  const state = controller.getState();

  expect(moved).toBe(true);
  expect(state).toMatchObject({ currentPlayer: "playerTwo" });
});

test("8.3", () => {
  const controller = new GameController(3);
  controller.setPlayerComputer("playerOne", true);

  controller.makeMove(0, 0);
  controller.makeMove(0, 1);

  controller.makeComputerMove();
  const state = controller.getState();

  expect(state.board[0][0]).toBe("S");
  expect(state.board[0][1]).toBe("O");
  expect(state.board[0][2]).toBe("S");
});

test("9.1", () => {
  const controller = new GameController(3);
  controller.setPlayerComputer("playerOne", true);
  controller.setPlayerComputer("playerTwo", true);

  controller.makeComputerMove();
  const state = controller.getState();

  expect(state.winner).not.toBeNull();
});
