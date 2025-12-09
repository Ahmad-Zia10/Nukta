import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/configure";
import bucketService from '../appwrite/bucket'
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { summarizePost as summarizePostAPI } from "../services/api";

export default function Post() {
    const [post, setPost] = useState(null);
    const [summary, setSummary] = useState(null);
    const [isLoadingSummary, setIsLoadingSummary] = useState(false);
    const [summaryError, setSummaryError] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);
    
    const isAuthor = post && userData ? post.userId === userData.$id : false;

    useEffect(() => {
        console.log("userData is ",userData);
        console.log("userData.$id ",userData.$id);
        
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) {
                    setPost(post);
                }
                else navigate("/");
            });
        } else navigate("/");
        
    }, [slug, navigate]);
    

    const deletePost = () => {
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                bucketService.deleteFile(post.featuredImage);
                navigate("/");
            }
        });
    };

    const handleSummarize = async () => {
        if (!slug) return;
        
        setIsLoadingSummary(true);
        setSummaryError(null);
        
        try {
            const response = await summarizePostAPI(slug);
            setSummary(response.data.summary);
        } catch (error) {
            setSummaryError(error.message || 'Failed to generate summary');
        } finally {
            setIsLoadingSummary(false);
        }
    };

    return post ? (
        <div className="py-8">
            <Container className={"text-center"}>
                <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
                    <img
                        src={bucketService.getFileView(post.featuredImage)}
                        alt={post.title}
                        className="rounded-xl h-1/2"
                    />

                    {isAuthor && (
                        <div className="absolute right-6 top-6">
                            <Link to={`/edit-post/${post.$id}`}>
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
                {summary && (
                    <div className="w-full mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                        <h2 className="text-xl font-bold mb-3 text-blue-800">AI Summary</h2>
                        <p className="text-gray-700 leading-relaxed">{summary}</p>
                    </div>
                )}

                {/* Error Display */}
                {summaryError && (
                    <div className="w-full mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                        <p className="text-red-700">{summaryError}</p>
                    </div>
                )}
                
                <div className="border-2 border-[#eee] rounded-[10px] bg-[#eee] text-[#222f3e] text-start px-5">
                    {parse(post.content)}
                </div>
            </Container>
        </div>
    ) : null;
}