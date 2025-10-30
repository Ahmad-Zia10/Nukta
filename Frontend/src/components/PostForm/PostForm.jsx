import React, { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {Button, Input, Select, RTE} from '../index'
import authService from '../../appwrite/bucket'
import configureService from '../../appwrite/configure'


export default function PostForm({post}) {

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    console.log("PostForm userData is ",userData)
    const {register, handleSubmit, watch, getValues, setValue, control} = useForm({
        defaultValues : {
            title : post?.title || '',
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",

        }
    })


    const submit = async (data) => {
        if(post) {
            const file = data.image[0] ? await authService.uploadFile(data.image[0]) : null;
            console.log(post);
            if(file) {
                await authService.deleteFile(post.featuredImage);
            }
            const dbPost = configureService.updatePost(post.$id ,{
                ...data, featuredImage : file ? file.$id : undefined
            })

            if(dbPost) {
                navigate(`/post/${dbPost.$id}`)
            }
        }
        else {
            const file = data.image[0] ? await authService.uploadFile(data.image[0]) : null;

            if(file) {
                console.log("Data from form is",data);
                console.log("userData with id is", userData.$id)
                
                const fileId = file.$id;
                data.featuredImage = fileId;
                const dbPost = await configureService.createPost({
                    ...data, userId : userData.$id
                });//The user that is creating the post should be linked to the post that he is creating so that we can connect different users to their personalized posts
                if(dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            }
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
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={authService.getFileView(post.featuredImage)}
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
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full" >
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}
