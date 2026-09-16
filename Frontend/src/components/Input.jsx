import React, { useId } from 'react'

const Input = React.forwardRef(function Input({
    type = 'text',
    label,
    className = '',
    error,
    ...props
}, ref) {
    const id = useId();
    const errorId = `${id}-error`;

    return (
        <div className='w-full'>
            {label && (
                <label
                    className='inline-block mb-1 pl-1'
                    htmlFor={id}
                >
                    {label}
                </label>
            )}
            <input
                type={type}
                className={`${className} px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border w-full ${
                    error ? 'border-red-500' : 'border-gray-200'
                }`}
                id={id}
                ref={ref}
                aria-invalid={error ? 'true' : undefined}
                aria-describedby={error ? errorId : undefined}
                {...props}
            />
            {error && (
                <p id={errorId} className='mt-1 pl-1 text-sm text-red-600'>
                    {error}
                </p>
            )}
        </div>
    )
})

export default Input
