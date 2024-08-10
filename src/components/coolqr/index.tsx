import React, { useMemo } from 'react';
// import { Defs, LinearGradient, Stop, Rect, Svg, Path, D } from 'react-svg';
import genMatrix from './genMatrix';
import transformMatrixIntoPath from './transformMatrixIntoCirclePath';


interface QRCodeProps {
    value: string;
    size: number;
    color: string; // Assuming color is always required
    backgroundColor: string; // Assuming backgroundColor is always required
    overlayColor: string;
    borderRadius: number;
    quietZone: number;
    enableLinearGradient: boolean;
    gradientDirection: [string, string, string, string];
    linearGradient: [string, string];
    ecl: 'L' | 'M' | 'Q' | 'H'; // Error correction level options: L, M, Q, H
    onError?: (error: Error) => void;
}

const CoolQRCode: React.FC<QRCodeProps> = ({
    value = 'Wallet QR code',
    size = 190,
    color,
    backgroundColor,
    overlayColor = '#FFFFFF',
    borderRadius = 24,
    quietZone = 8,
    enableLinearGradient = false,
    gradientDirection = ['0%', '0%', '100%', '100%'],
    linearGradient = ['rgb(255,255,255)', 'rgb(0,255,255)'],
    ecl = 'H',
    onError,
}) => {
    const result = useMemo(() => {
        try {
            return transformMatrixIntoPath(genMatrix(value, ecl), size);
        } catch (error) {
            if (onError && typeof onError === 'function') {
                onError(error as Error);
            } else {
                // Propagate the error when no handler is provided
                throw error;
            }
        }
    }, [value, size, ecl, onError]);

    if (!result) {
        return null;
    }

    const { path } = result;

    const eyeSize = 85


    return (
        <svg
            height={size}
            viewBox={`0 0 ${size + quietZone * 2} ${size + quietZone * 2}`}
            width={size}
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient
                    id="grad"
                    x1={gradientDirection[0]}
                    x2={gradientDirection[2]}
                    y1={gradientDirection[1]}
                    y2={gradientDirection[3]}
                    gradientTransform="rotate(45)"
                >
                    <stop offset="0" stopColor={linearGradient[0]} stopOpacity="1" />
                    <stop offset="1" stopColor={linearGradient[1]} stopOpacity="1" />
                </linearGradient>
            </defs>
            <g>
                <rect
                    fill={backgroundColor}
                    height={size + quietZone * 2}
                    rx={borderRadius}
                    width={size + quietZone * 2}
                    x="0"
                    y="0"
                />
            </g>
            <g>
                <path d={path} fill={enableLinearGradient ? 'url(#grad)' : color} />
                <QREyeWrapper
                    backgroundColor={backgroundColor}
                    fillColor={color}
                    overlayColor={color}
                    size={eyeSize}
                />
                <QREyeWrapper
                    backgroundColor={backgroundColor}
                    fillColor={color}
                    overlayColor={color}
                    size={eyeSize}
                    y={size - eyeSize / 3}
                />
                <QREyeWrapper
                    backgroundColor={backgroundColor}
                    fillColor={color}
                    overlayColor={color}
                    size={eyeSize}
                    x={size - eyeSize / 3}
                />
            </g>
        </svg>
    );
};

export default CoolQRCode;



// x and y attributes are not supported on <g> elements on web. Likewise, they are not supported on svg elements on React Native.
// Solution is to wrap with <svg> and pass x and y values to both.
const QREyes = ({ x = -1, y = -1, fillColor, size }: {
    x: number,
    y: number,
    fillColor: string,
    size: number
}) => (
    <svg x={x} y={y}>
        <g transform={`scale(${size / 120})`} x={x} y={y}>
            <path
                clipRule="evenodd"
                d="M0 12C0 5.37258 5.37258 0 12 0H28C34.6274 0 40 5.37258 40 12V28C40 34.6274 34.6274 40 28 40H12C5.37258 40 0 34.6274 0 28V12ZM28 6.27451H12C8.8379 6.27451 6.27451 8.8379 6.27451 12V28C6.27451 31.1621 8.8379 33.7255 12 33.7255H28C31.1621 33.7255 33.7255 31.1621 33.7255 28V12C33.7255 8.8379 31.1621 6.27451 28 6.27451Z"
                fill={fillColor}
                fillRule="evenodd"
            />
            <path
                d="M11 17C11 13.6863 13.6863 11 17 11H23C26.3137 11 29 13.6863 29 17V23C29 26.3137 26.3137 29 23 29H17C13.6863 29 11 26.3137 11 23V17Z"
                fill={fillColor}
            />
        </g>
    </svg>
)

const QREyeBG = ({ x = -1, y = -1, size, backgroundColor }: {
    x: number,
    y: number,
    backgroundColor: string,
    size: number
}) => (
    <svg x={x} y={y}>
        <g transform={`scale(${size / 120})`} x={x} y={y}>
            <path d="M0 0H40V40H0V0Z" fill={backgroundColor} />
        </g>
    </svg>
)

const QREyeWrapper = ({ x = 0, y = 0, backgroundColor, overlayColor, fillColor, size }
    : {
        x?: number,
        y?: number,
        overlayColor: string,
        fillColor: string,
        backgroundColor: string,
        size: number
    }
) => (
    <>
        <QREyeBG backgroundColor={backgroundColor} size={size} x={x} y={y} />
        <QREyes fillColor={fillColor} size={size} x={x} y={y} />
        <QREyes fillColor={overlayColor} size={size} x={x} y={y} />
    </>
)


export type GradientProps = {
    enableLinearGradient?: boolean
    linearGradient?: string[]
    gradientDirection?: string[]
    color?: string
}

type AddressQRCodeProps = {
    address: string
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
    size: number
    backgroundColor?: string
    color?: string
    safeAreaSize?: number
    safeAreaColor?: string
    gradientProps?: GradientProps
}

