
import * as PIXI from 'pixi.js';
import { DrawMap } from './draw-map';

export class DrawPixi
{
  getNewContainer() {
    return new PIXI.Container();
  }
  getNewGraphics() {
    return new PIXI.Graphics();
  }
  getSpriteFrom(ressource: any) {
    return PIXI.Sprite.from(ressource);
  }
  getNewBaseTexture(url: string) {
    return PIXI.Texture.from(url)
  }
  getNewTexture(baseTex: any, rectangle: any) {
    return new PIXI.Texture(baseTex, rectangle);
  }
  getNewTextureWhole(baseTex: any) {
    return new PIXI.Texture(baseTex);
  }
  getNewRectangle(x1: number, y1: number, x2: number, y2: number) {
    return new PIXI.Rectangle(x1, y1, x2, y2);
  }
  getNewBaseRenderTexture(options: any) {
    return new PIXI.BaseRenderTexture(options);
  }
  getNewRenderTexture(brt: any) {
    return new PIXI.RenderTexture(brt);
  }
  getNewPixiApp(options: any) {
    return this.pixiApp;
  }

  static instance: DrawPixi;

  pixiApp: PIXI.Application;
  backGraphics: PIXI.Graphics;

  canvas: HTMLCanvasElement;
  parent: DrawMap;
  
  Init(canvas: HTMLCanvasElement, parent: DrawMap) 
  {
    DrawPixi.instance = this;
    this.canvas = canvas;
    this.parent = parent;
    
    let options: any = {};
    options.view =  canvas;
    options.width = this.canvas.getBoundingClientRect().width;
    options.height = this.canvas.getBoundingClientRect().height;
    options.autoResize = true;
    //options.forceCanvas = true;
    
    this.backGraphics = new PIXI.Graphics();
    
    
    
    PIXI.utils.skipHello();
    this.pixiApp = new PIXI.Application(options);

    this.pixiApp.stage.addChild(this.backGraphics);
    
    this.pixiApp.ticker.add(() => {this.drawAll();});
  }

  drawAll()
  {
    if (this.pixiApp != null) 
    {
      //this.pixiApp.renderer.resize(this.canvas.width, this.canvas.height);
    }

    this.parent.drawAll();
  }

  clearGraphics() {
    this.backGraphics.clear();
  }

  FillRect(color: number, x: number, y: number, w: number, h: number) 
  {
    this.backGraphics.beginFill(color);
    this.backGraphics.drawRect(x, y, w, h);
    this.backGraphics.endFill();
    
  }
}