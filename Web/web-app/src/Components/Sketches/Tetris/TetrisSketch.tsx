import { observable } from "mobx";
import { observer } from "mobx-react";
import p5 from "p5";
import React, { useCallback } from "react";
import { ThemeStore } from "Stores/ThemeStore";

import { BaseSketch } from "../BaseSketch";
import { TetrisPropsStore } from "Models/Sketches/Tetris/TetrisPropsStore";
import { TetrisAbout } from "./TetrisAbout";
import { TetrisOptions } from "./TetrisOptions";
import { GridCell } from "Models/Sketches/Tetris/GridCell";
import { Tetrimino, TetriminoDefaults } from "Models/Sketches/Tetris/Tetrimino";

export interface TetrisSketchProps {
  themeStore: ThemeStore;
  propsStore: TetrisPropsStore;
}

export const TetrisSketch: React.FC<TetrisSketchProps> = observer(
  ({ themeStore, propsStore }) => {
    const sketch = useCallback((s: p5) => {
      const border = 20;
      const keysDown: Record<string, boolean> = {};
      let dasTimer = 0;
      let arrTimer = 0;
      const DAS = 200; // ms before repeat starts
      const ARR = 50; // ms between repeats after DAS

      s.keyPressed = () => {
        keysDown[s.key] = true;

        // Fire immediately on first press
        handleKeyPress(s.key);

        // Start DAS timer
        dasTimer = s.millis();
        arrTimer = s.millis();
      };

      s.keyReleased = () => {
        keysDown[s.key] = false;
      };
      const mouseClicked = () => {};

      const drawGrid = () => {
        s.stroke(0, 0, 0);

        for (let row = 0; row < propsStore.rows; ++row) {
          for (let col = 0; col < propsStore.cols; ++col) {
            propsStore.grid[row][col].draw(s);
          }
        }
      };

      const drawActiveTetrimino = () => {
        const at = propsStore.activeTetrimino;
        const cells = at.tetrimino.getOccupiedCells(
          propsStore.grid,
          at.x,
          at.y
        );
        for (const cell of cells) {
          cell.drawTetriminoColor(s, at.tetrimino.color);
        }
      };

      const isActiveTetriminoInvalid = (): boolean => {
        const at = propsStore.activeTetrimino;
        const tetrimino = at.tetrimino;

        for (const [dx, dy] of tetrimino.cells) {
          const x = at.x + dx;
          const y = at.y + dy;
          console;
          // Check bounds
          if (y < 0 || y >= propsStore.rows || x < 0 || x >= propsStore.cols) {
            return true;
          }

          // Check if the cell is already occupied
          const cell = propsStore.grid[y][x];
          if (cell.color) {
            return true;
          }
        }

        return false;
      };

      const checkLineClear = () => {
        const rowsToClear: number[] = [];

        // Step 1: Find full rows
        for (let row = 0; row < propsStore.rows; row++) {
          const isFull = propsStore.grid[row].every(
            (cell) => cell.color !== undefined
          );
          if (isFull) {
            rowsToClear.push(row);
          }
        }

        if (rowsToClear.length === 0) return; // nothing to clear

        // Step 2: Clear rows and shift everything above down
        for (const row of rowsToClear) {
          // Drop rows above down one step
          for (let y = row; y > 0; y--) {
            for (let x = 0; x < propsStore.cols; x++) {
              propsStore.grid[y][x].color = propsStore.grid[y - 1][x].color;
            }
          }

          // Clear the top row (row 0)
          for (let x = 0; x < propsStore.cols; x++) {
            propsStore.grid[0][x].color = undefined;
          }
        }
      };

      const saveTetriminoSpot = () => {
        const at = propsStore.activeTetrimino;
        const cells = at.tetrimino.getOccupiedCells(
          propsStore.grid,
          at.x,
          at.y
        );

        for (const cell of cells) {
          cell.color = at.tetrimino.color;
        }

        checkLineClear();

        addNewTetrimino();
      };

      const moveTetriminoDown = () => {
        propsStore.activeTetrimino.y++;
        if (isActiveTetriminoInvalid()) {
          propsStore.activeTetrimino.y--;
          saveTetriminoSpot();
        }
      };

      const addNewTetrimino = () => {
        const rand = s.random(TetriminoDefaults);
        propsStore.activeTetrimino = {
          tetrimino: new Tetrimino(s, rand),
          x: Math.floor(propsStore.cols / 2),
          y: 0,
        };
        if (isActiveTetriminoInvalid()) {
          init();
        }
      };

      const dropTetrimino = () => {
        const at = propsStore.activeTetrimino;
        while (!isActiveTetriminoInvalid()) {
          at.y++;
        }
        at.y--;
        saveTetriminoSpot();
      };

      const init = () => {
        const dx = (propsStore.width - border * 2) / propsStore.cols;
        const dy = (propsStore.height - border * 2) / propsStore.rows;
        let size = 0;
        let xOffset = 0;
        if (dx < dy) {
          size = dx;
        } else {
          size = dy;
          const gridWidth = size * propsStore.cols;
          const spacing = propsStore.width - gridWidth - border * 2;
          xOffset = spacing / 2;
        }

        propsStore.grid = [];
        for (let row = 0; row < propsStore.rows; ++row) {
          propsStore.grid[row] = [];
          for (let col = 0; col < propsStore.cols; ++col) {
            const x = col * size + border + xOffset;
            const y = row * size + border;
            propsStore.grid[row][col] = new GridCell(x, y, size);
          }
        }

        addNewTetrimino();
      };

      const handleKeyPress = (key: string) => {
        if (key === "a") {
          propsStore.activeTetrimino.x--;
          if (isActiveTetriminoInvalid()) propsStore.activeTetrimino.x++;
        } else if (key === "d") {
          propsStore.activeTetrimino.x++;
          if (isActiveTetriminoInvalid()) propsStore.activeTetrimino.x--;
        } else if (key === "s") {
          moveTetriminoDown();
        } else if (key === "q") {
          propsStore.activeTetrimino.tetrimino.rotateIfValid(
            propsStore.grid,
            propsStore.activeTetrimino.x,
            propsStore.activeTetrimino.y,
            true // clockwise
          );
        } else if (key === "e") {
          propsStore.activeTetrimino.tetrimino.rotateIfValid(
            propsStore.grid,
            propsStore.activeTetrimino.x,
            propsStore.activeTetrimino.y,
            false // counter-clockwise
          );
        } else if (key === "w") {
          dropTetrimino();
        }
      };

      s.setup = () => {
        const c = s.createCanvas(propsStore.width, propsStore.height);
        init();

        c.mouseClicked(mouseClicked);
      };

      s.draw = () => {
        if (propsStore.mustResize) {
          init();
        }
        s.background(themeStore.theme.backgroundColor.primary);
        s.noFill();
        s.stroke(255);
        const firstCell = propsStore.grid[0][0];
        s.rect(
          firstCell.x,
          firstCell.y,
          firstCell.size * propsStore.cols,
          firstCell.size * propsStore.rows
        );
        // Handle DAS/ARR
        const now = s.millis();
        if (keysDown["a"] || keysDown["d"] || keysDown["s"]) {
          if (now - dasTimer > DAS && now - arrTimer > ARR) {
            if (keysDown["a"]) handleKeyPress("a");
            if (keysDown["d"]) handleKeyPress("d");
            if (keysDown["s"]) handleKeyPress("s");
            arrTimer = now;
          }
        }
        drawGrid();
        drawActiveTetrimino();
        if (s.frameCount % 25 === 0) {
          moveTetriminoDown();
        }
      };
    }, []);

    return (
      <BaseSketch
        about={TetrisAbout}
        options={TetrisOptions}
        sketch={sketch}
        propsStore={propsStore}
        themeStore={themeStore}
      />
    );
  }
);

export const TetrisDefaultPropsStore = observable<TetrisPropsStore>({
  name: "Tetris",
  backgroundColor: "",
  width: 320,
  height: 320,
  mustResize: false,
  isGallery: false,
  rows: 20,
  cols: 10,
});
