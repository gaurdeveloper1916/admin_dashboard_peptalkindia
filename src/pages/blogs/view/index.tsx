import { useState, useEffect } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Eye,
  FileEdit,
  MoreHorizontal,
  Plus,
  Trash2,
  Search,
  FilterX,
} from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/custom/button";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  status: "published" | "draft";
  author: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  coverImage: string;
}

export default function view() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);

  const authToken = localStorage.getItem('token');;
  const navigate = useNavigate()
  const fetchBlogs = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (filterStatus) params.append("status", filterStatus);

      const response = await fetch(`${import.meta.env.VITE_PUBLIC_API_URL}/blogs`, {
        //@ts-ignore
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.status === 401) {
        localStorage.removeItem('token')
        toast({
          title: 'Session Expired',
          description: `Please Login again`,
        })
        navigate('/sign-in')

      }
      if (!response.ok) {
        throw new Error("Failed to fetch blogs");
      }
      const data = await response.json();
      setBlogs(data);
      setAllBlogs(data);
    } catch (error) {

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [filterStatus]);

  const handleSearch = (value: string) => {
    if (!value) {
      setBlogs(allBlogs);
      return;
    }
    const filteredBlogs = allBlogs.filter((item) =>
      item.title.toLowerCase().includes(value.toLowerCase())
    );

    setBlogs(filteredBlogs);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus(null);
  };

  const confirmDelete = (id: string) => {
    setBlogToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!blogToDelete) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_API_URL}/blogs/${blogToDelete}`,
        {
          method: "DELETE",
          //@ts-ignore
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete blog");
      }

      setBlogs((prev) => prev.filter((blog) => blog._id !== blogToDelete));
      //   toast({
      //     title: "Success",
      //     description: "Blog deleted successfully",
      //   });
     window.location.reload()
    } catch (error) {
      console.error("Error deleting blog:", error);
      //   toast({
      //     title: "Error",
      //     description: "Failed to delete blog. Please try again.",
      //     variant: "destructive",
      //   });
    } finally {
      setDeleteDialogOpen(false);
      setBlogToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-6">
        <h1 className="text-2xl font-bold tracking-tight">Blogs</h1>
        <Button >
          <a className="flex justify-center items-center" href="/admin/blogs/new">
            <Plus className="mr-2 h-4 w-4" />
            New Blog
          </a>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Blogs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex w-full md:w-1/2">
              <Input
                placeholder="Search blogs..."
                onChange={(e) => handleSearch(e.target.value)}
                className="rounded-r-none"
              />
              <Button className="rounded-l-none ">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button >
                    Status:{" "}
                    {filterStatus
                      ? filterStatus.charAt(0).toUpperCase() +
                      filterStatus.slice(1)
                      : "All"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilterStatus(null)}>
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setFilterStatus("published")}
                  >
                    Published
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("draft")}>
                    Draft
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                onClick={clearFilters}
                disabled={!searchTerm && !filterStatus}
              >
                <FilterX className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-6">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            </div>
          ) : blogs?.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No blogs found.{" "}
              <a
                href="/dashboard/blogs/new"
                className="text-primary hover:underline"
              >
                Create your first blog post
              </a>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Cover Image</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...blogs]?.reverse().map((blog) => (
                    <TableRow key={blog._id}>
                      <TableCell className="font-medium  capitalize">
                        {blog?.title}
                      </TableCell>
                      <TableCell>
                        <img
                          src={blog?.coverImage}
                          className="w-16 h-16  object-contain"
                        />
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${blog.status === "published"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                            }`}
                        >
                          {blog.status.charAt(0).toUpperCase() +
                            blog.status.slice(1)}
                        </span>
                      </TableCell>

                      <TableCell>
                        {new Date(blog.createdAt).toLocaleString()}
                      </TableCell>

                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <a href={`/admin/blogs/${blog._id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <a href={`/admin/blogs/${blog._id}`}>
                                <FileEdit className="mr-2 h-4 w-4" />
                                Edit
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => confirmDelete(blog._id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this blog?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              blog and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}