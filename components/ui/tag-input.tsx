"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface TagInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    values: string[]
    onValuesChange: (values: string[]) => void
    maxTags?: number
    placeholder?: string
}

export function TagInput({
    values = [],
    onValuesChange,
    maxTags = 5,
    placeholder,
    className,
    ...props
}: TagInputProps) {
    const [inputValue, setInputValue] = React.useState("")

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault()
            addTag()
        } else if (e.key === "Backspace" && inputValue === "" && values.length > 0) {
            onValuesChange(values.slice(0, -1))
        }
    }

    const addTag = () => {
        const trimmed = inputValue.trim().replace(/,/g, "")
        if (trimmed && !values.includes(trimmed) && values.length < maxTags) {
            onValuesChange([...values, trimmed])
            setInputValue("")
        }
    }

    const removeTag = (indexToRemove: number) => {
        onValuesChange(values.filter((_, index) => index !== indexToRemove))
    }

    return (
        <div className="flex flex-wrap gap-2 items-center rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
            {values.map((tag, index) => (
                <Badge key={index} variant="secondary" className="gap-1 pr-1">
                    {tag}
                    <button
                        type="button"
                        className="hover:bg-muted rounded-full p-0.5"
                        onClick={() => removeTag(index)}
                    >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {tag}</span>
                    </button>
                </Badge>
            ))}
            <input
                {...props}
                type="text"
                className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground min-w-[120px]"
                placeholder={values.length >= maxTags ? "" : placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => addTag()} // Optional: add tag on blur
                disabled={values.length >= maxTags || props.disabled}
            />
        </div>
    )
}
