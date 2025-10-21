import {GameController} from '../features/gameController';

test("resetting with size 5 creates a 5x5 board", () => {
  const controller = new GameController(3);

  controller.reset(5);
  expect(controller.getState().board.length).toBe(5);
  expect(controller.getState().board.every(row => row.length === 5)).toBe(true);
});

test("reset clamps size to range 3 to 10", () => {
  const controller = new GameController(3);

  controller.reset(2);
  expect(controller.getState().board.length).toBe(3);
  expect(controller.getState().board.every(row => row.length === 3)).toBe(true);

  controller.reset(12);
  expect(controller.getState().board.length).toBe(10);
  expect(controller.getState().board.every(row => row.length === 10)).toBe(true);
});

test('2.1', () => {
  const controller = new GameController(3);
  controller.setMode('general');

  expect(controller.getState().mode).toBe('general');
});

test('2.2', () => {
  const controller = new GameController(3);
  controller.makeMove(0, 0);
  controller.setMode('general');

  expect(controller.getState().mode).toBe('simple');
});

test('3.1', () => {
  const controller = new GameController(3, 'general');

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

test('4.1', () => {
  const controller = new GameController(3);
  controller.makeMove(1, 1); 
  const state = controller.getState();

  expect(state.board[1][1]).toBe('S');
});

test('4.2', () => {
  const controller = new GameController(3);
  controller.makeMove(0, 0); 
  expect(() => controller.makeMove(0, 0)).toThrow('Invalid move');
});

test('4.3', () => {
  const controller = new GameController(3);

  controller.makeMove(0, 0); 
  expect(controller.getState().currentPlayer).toBe('playerTwo');
  controller.makeMove(1, 1); 
  expect(controller.getState().currentPlayer).toBe('playerOne');
});

test('6.1', () => {
  const controller = new GameController(3, 'general');

  controller.makeMove(0, 0); 
  controller.makeMove(0, 1);  
  controller.makeMove(0, 2); 

  const state = controller.getState();

  expect(state.scores.playerOne).toBe(1); 
  expect(state.scores.playerTwo).toBe(0);
});

test('6.2', () => {
  const controller = new GameController(3, 'general');

  controller.makeMove(0, 0);
  controller.makeMove(0, 1); 
  controller.makeMove(0, 2); 

  const state = controller.getState();


  expect(state.currentPlayer).toBe('playerOne');        
  expect(state.scores.playerOne).toBeGreaterThan(0);
});
