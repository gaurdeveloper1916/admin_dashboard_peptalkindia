//@ts-nocheck
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";

function NewsLetter() {

  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${import.meta.env.VITE_PUBLIC_API_URL}/auth/user/inquiry`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );
        if (response.status === 401) {
          localStorage.removeItem('token')
          toast({
            title: 'Session Expired',
            description: `Please Login again`,
          })
          navigate('/sign-in')

          
        }

        if (!response.ok) {
          throw new Error("Failed to fetch inquiries");
        }

        const data = await response.json();
        setInquiries(data.data);
      } catch (error) {
        console.error("Error fetching inquiries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">News letter Inquiries</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>PDF Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {inquiries.length > 0 ? (
              inquiries.map((inquiry) => (
                <TableRow key={inquiry._id}>
                  <TableCell>{inquiry.fullName}</TableCell>
                  <TableCell>{inquiry.email}</TableCell>
                  <TableCell>Yes</TableCell>

                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="text-center">
                  No inquiries found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default NewsLetter;
