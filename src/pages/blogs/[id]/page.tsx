//@ts-nocheck
"use client";
import * as React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useParams, useNavigate, Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/custom/button";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { ImageUpload } from "@/components/ImageUpload";
import { useState, useEffect } from "react";
import TinyEditor from '../../../components/TinyEditor'
import { toast } from "@/components/ui/use-toast";

const blogSchema = z.object({
  title: z.string().min(5),
  slug: z
    .string()
    .min(5)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().min(10),
  content: z.any(),
  coverImage: z.string().min(1),
  status: z.enum(["draft", "published"]),
});

function getChangedFields(original = {}, current = {}) {
  const changed = {};

  for (const key in current) {
    // Compare deeply by stringifying
    if (JSON.stringify(original[key]) !== JSON.stringify(current[key])) {
      changed[key] = current[key];
    }
  }

  return changed;
}

export default function EditBlogPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: {
        type: "doc",
        content: [{ type: "paragraph", content: [{ type: "text", text: "" }] }],
      },
      coverImage: "",
      status: "draft",
    },
  });

  const generateSlug = () => {
    const title = form.getValues("title");
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    form.setValue("slug", slug, { shouldValidate: true });
  };

  const fetchBlog = async () => {
    setLoading(true);
    const myHeaders = new Headers();
    const authToken = localStorage.getItem("token");
    myHeaders.append("Authorization", `Bearer ${authToken}`);
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_API_URL}/blogs/${id}`,
        requestOptions
      );
      const result = await response.json();
      setLoading(false);
      if (result.blog._id) {
        setBlogData(result.blog);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, []);

  useEffect(() => {
    if (blogData) {
      form.reset({
        title: blogData.title || "",
        slug: blogData.slug || "",
        excerpt: blogData.excerpt || "",
        content: blogData.content || {
          type: "doc",
          content: [{ type: "paragraph", content: [{ type: "text", text: "" }] }],
        },
        coverImage: blogData.coverImage || "",
        status: blogData.status || "draft",
      });
    }
  }, [blogData, form]);

  const handleUploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      return data.secure_url;
    } catch (error) {
      throw error;
    }
  };

  const handleCoverImageUpload = (url) => {
    form.setValue("coverImage", url, { shouldValidate: true });
  };

  const onSubmit = async (values) => {
    try {
      setIsSubmitting(true);

      // Only send changed fields
      const changedData = getChangedFields(blogData || {}, values);

      if (Object.keys(changedData).length === 0) {
        // No changes made
        alert("No changes detected to save.");
        return;
      }

      const authToken = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_PUBLIC_API_URL}/blogs/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(changedData),
        }
      );
      if (res.status === 401) {
        localStorage.removeItem('token')
        toast({
          title: 'Session Expired',
          description: `Please Login again`,
        })
      }

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update blog");
      }
      navigate("/blogs/view");
    } catch (error) {
      console.error(error);
      alert(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link to="#">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Edit Blog</h1>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid md:grid-cols-2 gap-6"
        >
          <div className="space-y-6">
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
                          onChange={(e) => {
                            field.onChange(e);
                            generateSlug();
                          }}
                          disabled={isSubmitting}
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
                        <Textarea {...field} disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

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
                        <TinyEditor
                          form={form}
                          onChange={field.onChange}
                          handleUploadImage={handleUploadImage}
                          initialValue={blogData?.content}
                          value={blogData?.content}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
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
                Save Draft
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
        </form>
      </Form>
    </div>
  );
}
