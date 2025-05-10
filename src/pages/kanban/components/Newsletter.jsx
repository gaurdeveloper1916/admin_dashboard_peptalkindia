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

function NewsLetter() {

  

  const [inquiries, setInquiries] =  useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/user/inquiry`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

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
