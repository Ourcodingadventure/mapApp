declare const _default: {
    baseStyle: (props: Record<string, any>) => {
        borderWidth: number;
        borderRadius: string;
        p: string;
        borderColor: any;
        bg: any;
        _text: {
            ml: number;
        };
        _interactionBox: {
            position: string;
            zIndex: number;
            borderRadius: string;
        };
        _icon: {
            color: any;
        };
        _hover: {
            _interactionBox: {
                bg: string;
            };
        };
        _focus: {
            _interactionBox: {
                bg: string;
            };
        };
        _focusVisible: {
            _interactionBox: {
                bg: string;
            };
        };
        _checked: {
            _interactionBox: {
                borderColor: any;
            };
            borderColor: any;
        };
        _disabled: {
            opacity: number;
            _interactionBox: {
                bg: string;
            };
            _icon: {
                bg: string;
            };
        };
        _invalid: {
            borderColor: any;
        };
        _pressed: {
            _interactionBox: {
                bg: string;
            };
        };
    };
    sizes: {
        lg: {
            _icon: {
                size: number;
            };
            _text: {
                fontSize: string;
            };
        };
        md: {
            _icon: {
                size: number;
            };
            _text: {
                fontSize: string;
            };
        };
        sm: {
            _icon: {
                size: number;
            };
            _text: {
                fontSize: string;
            };
        };
    };
    defaultProps: {
        defaultIsChecked: boolean;
        size: string;
        colorScheme: string;
    };
};
export default _default;
