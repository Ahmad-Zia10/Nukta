import React from 'react'
import Button from './Button'

/**
 * Page controls for a paginated list. Renders nothing for a single page, so
 * callers can include it unconditionally.
 */
function Pagination({ page, totalPages, onPageChange, className = '' }) {
    if (!totalPages || totalPages <= 1) return null;

    return (
        <nav
            className={`flex items-center justify-center gap-4 ${className}`}
            aria-label="Pagination"
        >
            <Button
                size="sm"
                variant="ghost"
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
            >
                Previous
            </Button>

            <span className="text-sm" aria-live="polite">
                Page {page} of {totalPages}
            </span>

            <Button
                size="sm"
                variant="ghost"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
            >
                Next
            </Button>
        </nav>
    )
}

export default Pagination
