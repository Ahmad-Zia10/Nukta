import React from 'react'

function Logo({ width = '100px', className = '' }) {
  return (
    <span
      style={{ width }}
      className={`inline-block font-bold tracking-tight text-xl ${className}`}
    >
      Nukta
    </span>
  )
}

export default Logo
