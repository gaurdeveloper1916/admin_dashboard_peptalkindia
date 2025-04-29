"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast"
import { Loader2, ArrowLeft, EyeOff, Eye } from "lucide-react";
import { Button } from "@/components/custom/button";
import { ImageUpload } from "@/components/ImageUpload";
import TinyEditor from "@/components/TinyEditor";
// import TinyEditor from "./Tinyeditor";

const blogSchema = z.object({
    title: z.string().min(5, { message: "Title must be at least 5 characters" }),
    slug: z
        .string()
        .min(5, { message: "Slug must be at least 5 characters" })
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
            message: "Slug must contain only lowercase letters, numbers, and hyphens",
        }),
    excerpt: z
        .string()
        .min(10, { message: "Excerpt must be at least 10 characters" }),
    content: z.any(),
    coverImage: z.string().min(1, { message: "Cover image is required" }),
    status: z.enum(["draft", "published"]),
});

export default function EditBlogPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm({
        resolver: zodResolver(blogSchema),
        defaultValues: {
            title: "",
            slug: "",
            excerpt: "",
            content: {
                type: "doc",
                content: [
                    {
                        type: "paragraph",
                        content: [
                            {
                                type: "text",
                                text: "",
                            },
                        ],
                    },
                ],
            },
            coverImage:"https://images.pexels.com/photos/262508/pexels-photo-262508.jpeg",
            status: "draft",
        },
    });

    const generateSlug = () => {
        const title = form.getValues("title");
        if (!title) return;
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        form.setValue("slug", slug, { shouldValidate: true });
    };

    // const handleUploadImage = async (file: any) => {
    //     try {
    //         const formData = new FormData();
    //         formData.append("file", file);

    //         const response = await fetch("/api/upload/", {
    //             method: "POST",
    //             body: formData,
    //         });

    //         if (!response.ok) throw new Error("Image upload failed");

    //         const data = await response.json();
    //         return data.secure_url;
    //     } catch (error) {


    //         toast({
    //             title: "Upload Error",
    //             description: "Could not upload image. Try again.",
    //         })

    //         throw error;
    //     }
    // };

    const handleCoverImageUpload = (url:any) => {
        form.setValue("coverImage", url, { shouldValidate: true });
    };

    const AuthToken = localStorage.getItem('token');

    const onSubmit = async (data: any) => {
        try {
            setIsSubmitting(true);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/blogs`, {
                method: "POST",
                //@ts-ignore
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${AuthToken}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || "Failed to create blog");
            }

            toast({
                title: "Blog Posted",
                description: "Your blog has been successfully created!",
            });

        } catch (error) {
            toast({
                title: " Error",
                description: "Something went wrong",
            })

        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" asChild>
                        <a href="/blogs/new">
                            <ArrowLeft className="h-4 w-4" />
                        </a>
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight">Create Blog</h1>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-6">
                            {/* Blog Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Blog Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Blog title"
                                                        disabled={isSubmitting}
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            generateSlug();
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="slug"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Slug</FormLabel>
                                                <FormControl>
                                                    <Input {...field} disabled={isSubmitting} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="excerpt"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Excerpt</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        {...field}
                                                        placeholder="A short description"
                                                        className="resize-none min-h-[80px]"
                                                        disabled={isSubmitting}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            {/* Cover Image */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Cover Image</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <FormField
                                        control={form.control}
                                        name="coverImage"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <ImageUpload
                                                        value={field.value}
                                                        onChange={handleCoverImageUpload}
                                                        disabled={isSubmitting}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Content Editor */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Content</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <FormField
                                        control={form.control}
                                        name="content"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    {/* <RichTextEditor
                            initialContent={field.value}
                            onChange={field.onChange}
                            handleUploadImage={handleUploadImage}
                          /> */}
                                                    <TinyEditor
                                                        onChange={field.onChange}
                                                        // handleUploadImage={handleUploadImage}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <div className="flex justify-end gap-2 mt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        form.setValue("status", "draft");
                                        form.handleSubmit(onSubmit)();
                                    }}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting && form.getValues("status") === "draft" && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    <EyeOff className="mr-2 h-4 w-4" />
                                    Save as Draft
                                </Button>

                                <Button
                                    type="button"
                                    onClick={() => {
                                        form.setValue("status", "published");
                                        form.handleSubmit(onSubmit)();
                                    }}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting && form.getValues("status") === "published" && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    <Eye className="mr-2 h-4 w-4" />
                                    Publish
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}
