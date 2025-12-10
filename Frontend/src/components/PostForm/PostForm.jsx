import React, { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {Button, Input, Select, RTE} from '../index'
import { useCreatePostMutation, useUpdatePostMutation, getFileView } from '../../store/apiSlice'


export default function PostForm({post}) {

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const [createPost, { isLoading: isCreating }] = useCreatePostMutation();
    const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();
    
    const {register, handleSubmit, watch, getValues, setValue, control} = useForm({
        defaultValues : {
            title : post?.title || '',
            slug: post?.slug || "",
            content: post?.content || "",
            status: post?.status || "active",

        }
    })


    const submit = async (data) => {
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
        } catch (error) {
            console.error('Post submission error:', error);
            alert(error.message || 'Failed to save post');
        }
    }

    const slugTransformation = useCallback((value) => {
        if(value && typeof(value) === "string") {
            return value.trim().toLowerCase().replace(/[^a-zA-Z\d\s]+/g,"-").replace(/\s/g, "-");
        }
        return "";

    },[]);

    useEffect(() => {
        const subscription = watch((value, {name}) => {
            if(name === "title") {
                setValue("slug", slugTransformation(value.title), { shouldValidate: true })
            }
        })
        return () => subscription.unsubscribe();
    },[])




    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransformation(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4 "
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
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
                    {...register("status", { required: true })}
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
