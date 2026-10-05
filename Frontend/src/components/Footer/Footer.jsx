import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Logo from '../Logo'

function Footer() {
    const authStatus = useSelector((state) => state.auth.status);
    const year = new Date().getFullYear();

    return (
        <footer className="w-full border-t-2 border-t-black bg-gray-400 py-10">
            <div className="mx-auto max-w-7xl px-4">
                <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
                    <div className="max-w-sm">
                        <Logo width="100px" />
                        <p className="mt-2 text-sm text-gray-800">
                            Write and share what you know.
                        </p>
                    </div>

                    <nav aria-label="Footer">
                        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-700">
                            Navigate
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link className="text-gray-900 hover:underline" to="/">
                                    Home
                                </Link>
                            </li>
                            {authStatus ? (
                                <>
                                    <li>
                                        <Link className="text-gray-900 hover:underline" to="/my-posts">
                                            My Posts
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="text-gray-900 hover:underline" to="/add-post">
                                            Write a post
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link className="text-gray-900 hover:underline" to="/login">
                                            Log in
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="text-gray-900 hover:underline" to="/signup">
                                            Sign up
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </nav>
                </div>

                <p className="mt-8 border-t border-black/20 pt-6 text-sm text-gray-800">
                    &copy; {year} Nukta.
                </p>
            </div>
        </footer>
    )
}

export default Footer
