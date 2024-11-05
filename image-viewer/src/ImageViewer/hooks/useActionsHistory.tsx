import { useState } from "react";

export enum Actions {
  rotateRight = 1,
  rotateLeft,
  flipHorizontal,
  flipVertical,
  zoomIn,
  zoomOut,
}

// once this app scales, this could become a global state managed with a tool like zustand
export const useActionsHistory = () => {
  const [history, setHistory] = useState<{
    actions: Actions[];
    currentIndex: number;
  }>({
    actions: [],
    currentIndex: 0,
  });

  const { actions, currentIndex } = history;
  const lastPastAction = actions[currentIndex - 1];
  const nextAction = actions[currentIndex];
  const canUndo = currentIndex > 0;
  const canRedu = actions.length && currentIndex < actions.length;

  const incrementCurrentIndex = () => {
    setHistory((prev) => ({
      ...prev,
      currentIndex: prev.currentIndex + 1,
    }));
  };

  const goBack = () => {
    setHistory((prev) => ({
      ...prev,
      currentIndex: prev.currentIndex - 1,
    }));
  };

  const goForward = () => {
    setHistory((prev) => ({
      ...prev,
      currentIndex: prev.currentIndex + 1,
    }));
  };

  const addActionToHistory = (action: Actions) => {
    setHistory((prev) => {
      const newActions = prev.actions.slice(0, prev.currentIndex);
      newActions.push(action);
      return {
        actions: newActions,
        currentIndex: newActions.length,
      };
    });
  };

  const clearHistory = () => {
    setHistory({
      actions: [],
      currentIndex: 0,
    });
  };

  return {
    actions,
    currentIndex,
    lastPastAction,
    nextAction,
    canUndo,
    canRedu,
    incrementCurrentIndex,
    goBack,
    goForward,
    addActionToHistory,
    clearHistory,
  };
};
