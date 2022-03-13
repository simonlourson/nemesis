import { DrawPixi } from "./draw-pixi";

export class DrawMap {
  
  drawAll()
  {
    DrawPixi.instance.clearGraphics();
    DrawPixi.instance.FillRect(0x007AD9, 0, 0, 200, 200);
  }
}