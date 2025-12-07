import { useCallback, useRef, useState } from "react";
import { GameController } from "./gameController";
import {
  createControllerFromHeader,
  validateAndSortMoves,
  type ReplayPayload,
} from "./replay";

type UseReplayOptions = {
  controllerRef: React.MutableRefObject<GameController>;
  syncState: () => void;
  intervalMs?: number;
};

export const useReplay = ({
  controllerRef,
  syncState,
  intervalMs = 750,
}: UseReplayOptions) => {
  const timerRef = useRef<number | null>(null);
  const [isReplaying, setIsReplaying] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const stopReplay = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsReplaying(false);
  }, []);

  const startReplayFromSnapshot = useCallback(
    (payload: ReplayPayload) => {
      stopReplay();
      try {
        const moves = validateAndSortMoves(payload.moves ?? []);
        if (moves.length === 0) {
          setStatus("No moves to replay");
          return;
        }

        const controller = createControllerFromHeader(payload.header);
        controllerRef.current = controller;
        setIsReplaying(true);
        setStatus(null);
        syncState();

        let index = 0;
        timerRef.current = window.setInterval(() => {
          const move = moves[index];
          try {
            controller.applyRecordedMove(
              move.row,
              move.col,
              move.player,
              move.mark
            );
            syncState();
          } catch (error) {
            console.warn("Replay failed", error);
            stopReplay();
            setStatus("Replay failed: invalid move encountered");
            return;
          }

          index += 1;
          const finished =
            index >= moves.length || Boolean(controller.getState().winner);
          if (finished) {
            stopReplay();
            setStatus(`Replayed ${index} move(s)`);
            syncState();
          }
        }, intervalMs);
      } catch (error) {
        console.warn("Replay failed to start", error);
        setIsReplaying(false);
        const message =
          error instanceof Error ? error.message : "Replay failed to start";
        setStatus(message);
      }
    },
    [controllerRef, intervalMs, stopReplay, syncState]
  );

  const handleUploadedText = useCallback(
    (text: string) => {
      stopReplay();
      try {
        const parsed: ReplayPayload = JSON.parse(text);
        setStatus("Loaded replay");
        startReplayFromSnapshot(parsed);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Could not read file.";
        setStatus(message);
      }
    },
    [startReplayFromSnapshot, stopReplay]
  );

  const handleUploadedFile = useCallback(
    async (file: File) => {
      try {
        const text = await file.text();
        try {
          localStorage.setItem("sos-upload-preview", text);
        } catch {}
        setStatus(`Loaded ${file.name}`);
        handleUploadedText(text);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Could not read file.";
        setStatus(message);
      }
    },
    [handleUploadedText]
  );

  return {
    isReplaying,
    status,
    stopReplay,
    startReplayFromSnapshot,
    handleUploadedFile,
    handleUploadedText,
  };
};
