import type { IBoxProps } from '../../primitives';
export interface ICenterProps extends IBoxProps<ICenterProps> {
}
export declare type ICircleProps = IBoxProps<ICircleProps> & {
    size?: number | string;
};
export declare type ISquareProps = IBoxProps<ISquareProps> & {
    size?: number | string;
};
