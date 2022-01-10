import React from 'react';
import { IBoxProps } from '../../primitives';
import type { ResponsiveValue } from '../../../components/types';
import type { ISizes } from '../../../theme/base/sizes';
export interface IProgressProps extends IBoxProps<IProgressProps> {
    /**
     * Value of Progress.
     * @default 0
     */
    value?: number;
    /**
     * Defines height of Progress
     * @default sm
     */
    size?: ResponsiveValue<ISizes | (string & {}) | number>;
    /**
     * The color scheme of the progress. This should be one of the color keys in the theme (e.g."green", "red").
     * @default primary
     */
    colorScheme?: string;
    /**
     * Pseudo prop to give Prop to filled track
     */
    _filledTrack?: IBoxProps<IProgressProps>;
    /**
     * Min progress value
     * @default 0
     */
    min?: number;
    /**
     * Max progress value
     * @default 100
     */
    max?: number;
}
declare const _default: React.MemoExoticComponent<React.ForwardRefExoticComponent<IProgressProps & React.RefAttributes<unknown>>>;
export default _default;
