import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import {Button, Input, Select, RTE} from '../index'
import { useCreatePostMutation, useUpdatePostMutation, getFileView } from '../../store/apiSlice'


export default function PostForm({post}) {

    const navigate = useNavigate();
    const [createPost, { isLoading: isCreating }] = useCreatePostMutation();
    const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();
    
    const [error, setError] = useState("");
    const {register, handleSubmit, watch, getValues, setValue, control, formState: {errors}} = useForm({
        defaultValues : {
            title : post?.title || '',
            slug: post?.slug || "",
            content: post?.content || "",
            status: post?.status || "active",

        }
    })


    const submit = async (data) => {
        setError("");
        try {
            if(post) {
                // Update existing post
                const postData = {
                    slug: post.slug,
                    title: data.title,
                    content: data.content,
                    status: data.status,
                };
                
                // Add image if provided
                if(data.image?.[0]) {
                    postData.featuredImage = data.image[0];
                }

                const updatedPost = await updatePost(postData).unwrap();
                navigate(`/post/${updatedPost.slug}`);
            }
            else {
                // Create new post
                const postData = {
                    title: data.title,
                    slug: data.slug,
                    content: data.content,
                    status: data.status,
                    featuredImage: data.image?.[0] || null,
                };

                const createdPost = await createPost(postData).unwrap();
                navigate(`/post/${createdPost.slug}`);
            }
        } catch (err) {
            // RTK Query puts the server payload on `data`; `error` carries
            // transport failures. `message` alone renders as undefined.
            setError(err?.data?.message || err?.error || err?.message || 'Failed to save post');
        }
    }

    const slugTransformation = useCallback((value) => {
        if(value && typeof(value) === "string") {
            return value.trim().toLowerCase().replace(/[^a-zA-Z\d\s]+/g,"-").replace(/\s/g, "-");
        }
        return "";

    },[]);

    // Auto-fill the slug from the title, but only when creating. On an existing
    // post the slug is its identity and the API ignores changes to it, so
    // rewriting the field would show the author a slug that is never saved.
    useEffect(() => {
        if (post) return undefined;

        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransformation(value.title), { shouldValidate: true });
            }
        });
        return () => subscription.unsubscribe();
    }, [post, watch, setValue, slugTransformation])




    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            {error && (
                <div className="w-full px-2 mb-4">
                    <p className="rounded-lg bg-red-50 border border-red-200 p-3 text-red-700">
                        {error}
                    </p>
                </div>
            )}
            <div className="w-full px-2 lg:w-2/3">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    error={errors.title?.message}
                    {...register("title", { required: "Title is required" })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4 disabled:bg-gray-100 disabled:text-gray-500"
                    error={errors.slug?.message}
                    // A post's slug is its identity and the API ignores changes
                    // to it, so it is fixed once the post exists.
                    disabled={Boolean(post)}
                    {...register("slug", { required: "Slug is required" })}
                    onInput={(e) => {
                        if (post) return;
                        setValue("slug", slugTransformation(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                {post && (
                    <p className="-mt-2 mb-4 pl-1 text-sm text-gray-600">
                        The slug cannot be changed after a post is created.
                    </p>
                )}
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-full px-2 mt-6 lg:mt-0 lg:w-1/3">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4 "
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    error={errors.image?.message}
                    {...register("image", {
                        required: post ? false : "A featured image is required",
                    })}
                />
                {post && post.featuredImage && (
                    <div className="w-full mb-4">
                        <img
                            src={getFileView(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4 "
                    error={errors.status?.message}
                    {...register("status", { required: "Status is required" })}
                />
                <Button 
                    type="submit" 
                    bgColor={post ? "bg-green-500" : undefined} 
                    className="w-full"
                    disabled={isCreating || isUpdating}
                >
                    {isCreating || isUpdating ? "Saving..." : post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}
