import p5 from "p5";

export interface GlassStrip {
    pos: p5.Vector;
    theta: number;
    width: number;
    color: string;
    stripDeltaTheta: number;
}