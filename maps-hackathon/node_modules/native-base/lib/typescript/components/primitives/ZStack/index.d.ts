import React from 'react';
import { IBoxProps } from '../Box';
export interface IZStackProps extends IBoxProps<IZStackProps> {
    /**
     * The direction to stack the elements.
     */
    reversed?: boolean;
}
declare const _default: React.MemoExoticComponent<React.ForwardRefExoticComponent<IZStackProps & React.RefAttributes<unknown>>>;
export default _default;
