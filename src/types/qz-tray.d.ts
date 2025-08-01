// src/types/qz-tray.d.ts
declare module "qz-tray" {
  interface QZ {
    websocket: {
      connect(): Promise<void>;
      disconnect(): void;
      isActive(): boolean;
    };
    printers: {
      find(): Promise<string>;
    };
    configs: {
      create(printer: string): any;
    };
    print(config: any, data: string[]): Promise<void>;
  }

  const qz: QZ;
  export default qz;
}
