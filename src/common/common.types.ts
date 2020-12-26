export interface Children {
  children: React.ReactNode;
}

export type Dispatch = (action: any) => void;

export interface StringKeyObject {
  [key: string]: any;
}

export enum FileType {
  SVG = 'SVG',
  PNG = 'PNG',
}

export enum ERequestStatus {
  INITIAL,
  PROCESSING,
  WITH_DATA,
  WITH_ERROR,
}
