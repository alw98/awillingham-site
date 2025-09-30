import { observable, toJS } from "mobx";
import { observer } from "mobx-react";
import p5 from "p5";
import React, { useCallback } from "react";
import { ThemeStore } from "Stores/ThemeStore";

import { BaseSketch } from "../BaseSketch";
import { StainedGlassAbout } from "./StainedGlassAbout";
import { StainedGlassOptions } from "./StainedGlassOptions";
import { BaseSketchPropsStore } from "Models/Sketches/BaseSketchPropsStore";

import { StainedGlassSketchPropsStore } from "Models/Sketches/StainedGlass/StainedGlassSketchPropsStore";
import { GlassStrip } from "Models/Sketches/StainedGlass/GlassStrip";
import { ColorPalletes, getRandomColor } from "Themes/ColorPalletes";

export interface StainedGlassSketchProps {
  themeStore: ThemeStore;
  propsStore: StainedGlassSketchPropsStore;
}

export const StainedGlassSketch: React.FC<StainedGlassSketchProps> = observer(
  ({ themeStore, propsStore }) => {
    const sketch = useCallback((s: p5) => {
      let strips: GlassStrip[];

      const getRandomDist = () => {
        // calculate the mean and standard deviation based on the parameters
        let mean =
          propsStore.minStripDist +
          (propsStore.maxStripDist - propsStore.minStripDist) *
            propsStore.averageStripDistPct;
        let sd = (propsStore.maxStripDist - propsStore.minStripDist) / 6; // arbitrary choice of 6 as a scaling factor
        // generate a random number from a normal distribution using the Box-Muller transform
        let u1 = Math.random();
        let u2 = Math.random();
        let z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        let num = mean + sd * z;
        // round the number to the nearest integer
        num = Math.round(num);
        // make sure the number is within the range
        num = Math.max(num, propsStore.minStripDist);
        num = Math.min(num, propsStore.maxStripDist);
        return num;
      };

      const init = () => {
        s.background(themeStore.theme.backgroundColor.primary);
        if (propsStore.showGrid) {
          for (
            let x = 0;
            x <= propsStore.width / 2;
            x += propsStore.gridCellWidth
          ) {
            for (
              let y = 0;
              y <= propsStore.height;
              y += propsStore.gridCellHeight
            ) {
              s.circle(x, y, 5);
            }
          }
        }

        strips = [];
        for (let i = 0; i < propsStore.stripCount; ++i) {
          const x = (Math.random() * propsStore.width) / 2;
          const y = Math.random() * propsStore.height;
          const theta = Math.random() * Math.PI * 2;
          const color = getRandomColor();
          const width =
            propsStore.minStripWidth +
            Math.random() *
              (propsStore.maxStripWidth - propsStore.minStripWidth);
          const stripDeltaTheta = Math.PI / (Math.floor(Math.random() * 3) + 4);
          strips.push({
            pos: new p5.Vector(x, y),
            theta,
            color,
            width,
            stripDeltaTheta,
          });
        }
      };

      s.setup = () => {
        s.createCanvas(propsStore.width, propsStore.height);
        // s.frameRate(1);
        init();
      };

      s.draw = () => {
        if (propsStore.mustResize) {
          init();
        }

        s.scale(-1, 1);
        s.image(
          s.get(0, 0, propsStore.width / 2, propsStore.height),
          -propsStore.width,
          0,
          propsStore.width / 2,
          propsStore.height
        );
        s.scale(-1, 1);
        s.noStroke();

        for (let i = strips.length - 1; i >= 0; --i) {
          const strip = strips[i];
          s.push();
          s.translate(strip.pos.x, strip.pos.y);
          s.rotate(strip.theta - Math.PI / 2);
          s.fill(strip.color);
          const dist = getRandomDist();
          s.rect(0, 0, strip.width, dist);
          s.pop();

          const newX = strip.pos.x + Math.cos(strip.theta) * dist;
          const newY = strip.pos.y + Math.sin(strip.theta) * dist;
          strip.pos.x = newX;
          strip.pos.y = newY;

          strip.theta += Math.round(Math.random())
            ? -strip.stripDeltaTheta
            : strip.stripDeltaTheta;
          if (
            strip.pos.x < 0 ||
            strip.pos.x > propsStore.width / 2 ||
            strip.pos.y < 0 ||
            strip.pos.y > propsStore.height
          ) {
            strips.splice(i, 1);
          }
        }
      };
    }, []);

    return (
      <BaseSketch
        about={StainedGlassAbout}
        options={StainedGlassOptions}
        propsStore={propsStore}
        themeStore={themeStore}
        sketch={sketch}
      />
    );
  }
);

export const StainedGlassDefaultPropsStore =
  observable<StainedGlassSketchPropsStore>({
    name: "StainedGlass",
    backgroundColor: "",
    width: 320,
    height: 320,
    mustResize: false,
    isGallery: false,
    showGrid: false,
    gridCellWidth: 32,
    gridCellHeight: 32,
    stripCount: 20,
    stripDeltaTheta: Math.PI / 4,
    minStripWidth: 5,
    maxStripWidth: 7,
    minStripDist: 10,
    maxStripDist: 75,
    averageStripDistPct: 0.25,
  });
