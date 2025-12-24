import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetPostQuery, useDeletePostMutation, useLazySummarizePostQuery, getFileView } from "../store/apiSlice";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    
    const { data: post, isLoading, isError } = useGetPostQuery(slug, {
        skip: !slug,
    });
    const [deletePostMutation] = useDeletePostMutation();
    const [triggerSummarize, { data: summaryData, isLoading: isLoadingSummary, error: summaryError }] = useLazySummarizePostQuery();
    
    const isAuthor = post && userData ? post.userId?._id === userData._id : false;
    

    const deletePost = async () => {
        try {
            await deletePostMutation(post.slug).unwrap();
            navigate("/");
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete post');
        }
    };

    const handleSummarize = () => {
        if (slug) {
            triggerSummarize(slug);
        }
    };

    if (!slug) {
        navigate("/");
        return null;
    }

    if (isLoading) {
        return (
            <div className="py-8 text-center">
                <p>Loading post...</p>
            </div>
        );
    }

    if (isError || !post) {
        navigate("/");
        return null;
    }

    return (
        <div className="py-8">
            <Container className={"text-center"}>
                <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
                    <img
                        src={getFileView(post.featuredImage)}
                        alt={post.title}
                        className="rounded-xl h-1/2"
                    />

                    {isAuthor && (
                        <div className="absolute right-6 top-6">
                            <Link to={`/edit-post/${post.slug}`}>
                                <Button bgColor="bg-green-500" className="mr-3">
                                    Edit
                                </Button>
                            </Link>
                            <Button bgColor="bg-red-500" onClick={deletePost}>
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
                <div className="w-full mb-6">
                    <h1 className="text-2xl font-bold">{post.title}</h1>
                </div>
                
                {/* Summarize Button */}
                <div className="w-full mb-6 flex justify-center">
                    <Button 
                        bgColor="bg-blue-500" 
                        onClick={handleSummarize}
                        disabled={isLoadingSummary}
                        className="hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoadingSummary ? 'Generating Summary...' : 'Summarize Post'}
                    </Button>
                </div>

                {/* Summary Display */}
                {summaryData?.summary && (
                    <div className="w-full mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                        <h2 className="text-xl font-bold mb-3 text-blue-800">AI Summary</h2>
                        <p className="text-gray-700 leading-relaxed">{summaryData.summary}</p>
                    </div>
                )}

                {/* Error Display */}
                {summaryError && (
                    <div className="w-full mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                        <p className="text-red-700">{summaryError?.message || 'Failed to generate summary'}</p>
                    </div>
                )}
                
                <div className="border-2 border-[#eee] rounded-[10px] bg-[#eee] text-[#222f3e] text-start px-5">
                    {parse(post.content)}
                </div>
            </Container>
        </div>
    );
}
