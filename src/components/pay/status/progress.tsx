import React from "react";

interface CircleProgressProps {
    size?: number;
    isIndeterminate?: boolean;
    index?: number;
    status: "waiting" | "success" | "error" | "pending";
}

export function CircleProgress({ size = 40, isIndeterminate = false, index, status = "success" }: CircleProgressProps) {
    const radius = size / 2;
    const stroke = 4;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    const color = {
        waiting: "text-muted-foreground",
        success: "text-green-500",
        error: "text-red-500",
        pending: "text-primary",
    }

    return (
        <>
            <span className="hidden text-green-500 text-red-500 text-muted-foreground"></span>
            <div
                className={`${color[status]} relative flex items-center justify-center ${isIndeterminate || status === "pending" ? "animate-spin" : ""
                    }`}
                style={{ width: size, height: size }}
            >

                {index && !(isIndeterminate || status === "pending") && index}
                <svg
                    className={`absolute ${color[status]}`}
                    height={size}
                    width={size}
                >
                    <circle
                        stroke="currentColor"
                        fill="transparent"
                        strokeWidth={stroke}
                        strokeDasharray={circumference + " " + circumference}
                        strokeDashoffset={0}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        className={`${isIndeterminate || status === "pending" ? "opacity-25" : ""}`}
                    />
                </svg>
                {isIndeterminate || status === "pending" && (
                    <svg
                        className={`absolute ${color[status]}`}
                        height={size}
                        width={size}
                    >
                        <circle
                            stroke="currentColor"
                            fill="transparent"
                            strokeWidth={stroke}
                            strokeDasharray={circumference + " " + circumference}
                            strokeDashoffset={circumference * 0.75}
                            r={normalizedRadius}
                            cx={radius}
                            cy={radius}
                            className="transition-all duration-500"
                        />
                    </svg>
                )}
            </div>
        </>
    );
}