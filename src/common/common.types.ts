import { FormikProps } from 'formik';

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

export type TFormikForm = FormikProps<Record<string, any>>;

export type TRef = React.RefObject<TFormikForm>;
