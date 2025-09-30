import React from "react";

import { BaseOptions } from "../BaseOptions";

interface TetrisAboutProps {
  onClose: () => void;
}

export const TetrisAbout: React.FC<TetrisAboutProps> = ({ onClose }) => {
  return (
    <BaseOptions onClose={onClose}>
      <div>Tetris! In preparation for my harware project Less Is More</div>
    </BaseOptions>
  );
};
