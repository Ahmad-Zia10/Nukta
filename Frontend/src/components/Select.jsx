import React, { useId } from 'react'

function Select({
    options,
    className = '',
    label,
    error,
    ...props
}, ref) {
    const id = useId();
    const errorId = `${id}-error`;

    return (
        <div className='w-full'>
            {label && (
                <label className='inline-block mb-1 pl-1' htmlFor={id}>
                    {label}
                </label>
            )}
            <select
                className={`${className} px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border w-full ${
                    error ? 'border-red-500' : 'border-gray-200'
                }`}
                id={id}
                ref={ref}
                aria-invalid={error ? 'true' : undefined}
                aria-describedby={error ? errorId : undefined}
                {...props}
            >
                {options?.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            {error && (
                <p id={errorId} className='mt-1 pl-1 text-sm text-red-600'>
                    {error}
                </p>
            )}
        </div>
    )
}

export default React.forwardRef(Select);
