
import { Vector2 } from './vector2';

export class CameraService
{
    
  targetCameraOffset: Vector2;

  // Offset is in tile coordinates
  cameraOffset: Vector2;

  // Zoom is the number of pixels between cells
  currentZoom: number;

  spinner: number;

  private sinWaveTime: number;
  sinWave: number;
  
  private targetZoom: number;
  private lastZoomCenter: Vector2 = new Vector2();

  private static cameraService_: CameraService;
  static get cameraService(): CameraService {
    return CameraService.cameraService_;
  }

  constructor(container: any)
  {
    if (CameraService.cameraService_ == null) CameraService.cameraService_ = this;
    this.cameraOffset = new Vector2();
    this.targetCameraOffset = new Vector2();
    this.currentZoomIndex = 7;
    //this.currentZoomIndex = 13;
    this.targetZoom = this.currentZoom = this.zoomLevels[this.currentZoomIndex];
    this.sinWaveTime = 0;
    this.sinWave = 0;
    this.spinner = 0;

    this.observersCameraChange = [];
    this.observersToAnimationChange = [];
  }

  observersCameraChange: IObsCameraChanged[];
  subscribeCameraChange(observer: IObsCameraChanged) {
    this.observersCameraChange.push(observer);
  }

  observersToAnimationChange: IObsAnimationChanged[];
  subscribeAnimationChange(observer: IObsAnimationChanged) {
    this.observersToAnimationChange.push(observer);
  }

  updateZoom()
  {
    // Snap if close enough
    if (this.currentZoom == this.targetZoom)
      return;
    if (Math.abs(this.currentZoom - this.targetZoom) < 0.1)
      this.changeZoom(this.targetZoom - this.currentZoom, this.lastZoomCenter);
    else
      this.changeZoom((this.targetZoom - this.currentZoom) / 10, this.lastZoomCenter);
  }

  resetSinWave() {
    this.sinWaveTime = 45;
  }

  updateAnimations(deltaTime: number) {
    this.updateSinWave(deltaTime);
    this.updateSpinner(deltaTime);
    this.updateLinearReset(deltaTime);

    this.observersToAnimationChange.map((observer) => { observer.animationChanged(); })
  }

  updateSinWave(deltaTime: number) {
    this.sinWaveTime += deltaTime / 3;
    if (this.sinWaveTime > 360) this.sinWaveTime -= 360;

    this.sinWave = Math.sin(this.sinWaveTime * Math.PI / 180) / 2 + 0.5;
  }

  updateSpinner(deltaTime: number) {
    this.spinner += deltaTime / 6;
    if (this.spinner > 360) this.spinner -= 360;
  }

  linearReset: number = 0;
  updateLinearReset(deltaTime: number) {
    this.linearReset += deltaTime / 12 / 100;
    while (this.linearReset > 1) this.linearReset -= 1;
  }

  resetZoom(canvasSize: Vector2)
  {
    this.currentZoomIndex = 7;
    //this.currentZoomIndex = 13;
    this.targetZoom = this.currentZoom = this.zoomLevels[this.currentZoomIndex];

    this.cameraOffset.x = canvasSize.x * 0.5 / this.currentZoom;
    this.cameraOffset.y = canvasSize.y * 0.5 / this.currentZoom;
  }

  // Public because this is used by the export images dialog
  public zoomLevels: number[] = [16, 18, 20, 23, 27, 32, 38, 45, 54, 64, 76, 90, 108, 128]
  private currentZoomIndex: number
  zoom(delta: number, zoomCenter: Vector2)
  {
      this.lastZoomCenter = zoomCenter;
      this.currentZoomIndex += delta;
      if (this.currentZoomIndex < 0) this.currentZoomIndex = 0;
      if (this.currentZoomIndex >= this.zoomLevels.length) this.currentZoomIndex = this.zoomLevels.length - 1;

      this.targetZoom = this.zoomLevels[this.currentZoomIndex];
  }

  setHardZoom(zoomLevel: number) {
    this.targetZoom = this.currentZoom = zoomLevel;

    let zoomLevelDif = -1;
    for (let zoomLevelIndex = 0; zoomLevelIndex < this.zoomLevels.length; zoomLevelIndex++) {
      let dif = Math.abs(zoomLevel - this.zoomLevels[zoomLevelIndex]);
      if (zoomLevelDif == -1 || dif < zoomLevelDif) {
        this.currentZoomIndex = zoomLevelIndex;
        zoomLevelDif = dif;
      }
    }
  }

  changeZoom(zoomDelta: number, zoomCenter: Vector2)
  {
      // TODO fix targetCameraOffset
      let oldZoomCenterTile: Vector2 = this.getTileCoordsForZoom(zoomCenter);

      this.currentZoom += zoomDelta;

      let newZoomCenterTile: Vector2 = this.getTileCoordsForZoom(zoomCenter);

      this.cameraOffset.x += newZoomCenterTile.x - oldZoomCenterTile.x;
      this.cameraOffset.y += newZoomCenterTile.y - oldZoomCenterTile.y;
      this.targetCameraOffset.x += newZoomCenterTile.x - oldZoomCenterTile.x;
      this.targetCameraOffset.y += newZoomCenterTile.y - oldZoomCenterTile.y;
  }

  // TODO refactor this
  getTileCoordsForZoom(screenCoords: Vector2): Vector2 
  {
      let returnValue: Vector2 = new Vector2();

      returnValue.x = screenCoords.x / this.currentZoom - this.cameraOffset.x;
      returnValue.y = screenCoords.y / this.currentZoom - this.cameraOffset.y;

      return returnValue;
  }

  getTileCoords(cursorPosition: Vector2): Vector2
  {
      return new Vector2(
      cursorPosition.x / this.currentZoom - this.cameraOffset.x,
      -cursorPosition.y / this.currentZoom + this.cameraOffset.y
      );
  }

}

export interface IObsCameraChanged {
  cameraChanged(camera: CameraService): void;
}

export interface IObsAnimationChanged {
  animationChanged(): void;
}