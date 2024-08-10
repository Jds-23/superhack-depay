import * as React from "react"

import { cn } from "@/lib/utils"
import { parseUnits } from "viem"
import { on } from "events"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

const CurrencyInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, value, onChange, ...props }, ref) => {

    const [inputValue, setInputValue] = React.useState("1")

    React.useEffect(() => {
      const parsedValue = parseUnits(inputValue, 6)
      onChange?.({
        target: {
          value: parsedValue.toString(),
        },
      } as React.ChangeEvent<HTMLInputElement>)
    }, [inputValue])

    return (
      <div
        className={cn(
          "flex h-9 w-full rounded-md items-center border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      >
        <p
          style={{
            paddingBlock: "1px",
            paddingInline: "2px",
          }}
        >
          $
        </p>
        <input
          type={type}
          ref={ref}
          className="focus-visible:outline-none"
          style={{
            border: "none",
            flexGrow: 1,
          }}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
          }}
          {...props}
        />
      </div>
    )
  }
)

export { Input, CurrencyInput }
