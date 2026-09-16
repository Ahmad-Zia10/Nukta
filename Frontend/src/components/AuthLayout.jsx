import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

/**
 * Route guard.
 *
 * `authentication` is a boolean: `true` for pages that require a signed-in user,
 * `false` for pages only anonymous users should see (login, signup).
 *
 * The redirect waits for `auth.checked`. Before the session check against
 * /api/auth/me resolves, `auth.status` is false only because the answer is not
 * known yet -- acting on it would bounce a signed-in user to /login on every
 * hard refresh of a protected page.
 */
export default function Protected({ children, authentication = true }) {
    const navigate = useNavigate();
    const authStatus = useSelector((state) => state.auth.status);
    const authChecked = useSelector((state) => state.auth.checked);

    const required = Boolean(authentication);
    const allowed = authChecked && authStatus === required;

    useEffect(() => {
        if (!authChecked) return;

        if (required && !authStatus) {
            navigate('/login', { replace: true });
        } else if (!required && authStatus) {
            navigate('/', { replace: true });
        }
    }, [authChecked, authStatus, required, navigate]);

    if (!authChecked) {
        return (
            <div className="w-full py-8 text-center">
                <p className="text-xl">Loading...</p>
            </div>
        );
    }

    // Render nothing while the redirect above is in flight, so a protected page
    // never flashes its contents to a signed-out visitor.
    return allowed ? <>{children}</> : null;
}
