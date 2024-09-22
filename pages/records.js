import { useEffect, useState } from "react";
import axios from "axios";
import { decode } from "jsonwebtoken";
import { useRouter } from "next/router";

const Records = () => {
  const [records, setRecords] = useState([]);
  const [newRecord, setNewRecord] = useState({
    first_name: "",
    last_name: "",
    location: "",
  });
  const [editingRecord, setEditingRecord] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const getValue = localStorage.getItem("token");

    const newValue = JSON.parse(getValue);
    console.log(newValue?.role, "new");
    setUserRole(newValue?.role);
    const fetchRecords = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const response = await axios.get("/api/records", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setRecords(response.data);

          const decoded = decode(token);
          console.log(decoded, "ert");
        } catch (error) {
          console.error("Error fetching records:", error);
        }
      }
    };

    fetchRecords();
  }, []);

  const handleAddRecord = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, cannot add record");
        return;
      }

      const response = await axios.post("/api/records", newRecord, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 201) {
        setRecords([...records, response.data]);
        setModalOpen(false);
        setNewRecord({ first_name: "", last_name: "", location: "" });
        fetchRecords();
      } else {
        console.error("Failed to add record:", response);
      }
    } catch (error) {
      if (error.response) {
        console.error("Error adding record:", error.response.data);
        if (error.response.status === 403) {
          console.error("You do not have permission to add records.");
        }
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error:", error.message);
      }
    }
  };

  const handleEditRecord = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Editing record ID:", editingRecord.id);
      const response = await axios.put(`/api/records`, editingRecord, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Error updating record:", error);
    }
  };

  const handleDeleteRecord = async (id) => {
    if (confirm("Are you sure you want to delete this record?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/api/records/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecords(records.filter((record) => record.id !== id));
      } catch (error) {
        console.error("Error deleting record:", error);
      }
    }
  };
  console.log(userRole, "role");

  const handlelogOut = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div>
      <div className="flex justify-between items-center gap-5 bg-blue-500 w-full h-[50px] px-4">
        <div className="flex gap-5">
          <h1 id="h1" className="text-white ">
            Records
          </h1>
          <h3 id="h3" className="text-white ">
            User Role: {userRole}
          </h3>
        </div>
        <button
          id="button"
          className="bg-blue-500 text-white px-4 py-2 rounded ml-auto"
          onClick={handlelogOut}
        >
          Logout
        </button>
      </div>
      <div className="mt-10 mx-auto w-full max-w-4xl">
        {userRole === "Admin" && (
          <button
            id="button"
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setModalOpen(true)}
          >
            Add Record
          </button>
        )}

        <table
          id="table"
          className="w-full mt-5 border border-black border-collapse"
        >
          <thead>
            <tr id="tr">
              <th id="th" className="border border-black px-4 py-2">
                First Name
              </th>
              <th id="th" className="border border-black px-4 py-2">
                Last Name
              </th>
              <th id="th" className="border border-black px-4 py-2">
                Location
              </th>
              {userRole === "Admin" && (
                <th id="th" className="border border-black px-4 py-2">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {records.length > 0 ? (
              records[0].map((record) => (
                <tr id="tr" key={record.id}>
                  <td id="td" className="border border-black px-4 py-2">
                    {record.first_name}
                  </td>
                  <td id="td" className="border border-black px-4 py-2">
                    {record.last_name}
                  </td>
                  <td id="td" className="border border-black px-4 py-2">
                    {record.location}
                  </td>
                  {userRole === "Admin" && (
                    <td className="border border-black px-4 py-2">
                      <div className="flex space-x-4">
                        <button
                          id="button"
                          className="bg-yellow-500 text-black px-4 py-2 rounded"
                          onClick={() => {
                            setEditingRecord(record);
                            setEditModalOpen(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          id="button"
                          className="bg-red-500 text-white px-4 py-2 rounded"
                          onClick={() => handleDeleteRecord(record.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  id="td"
                  colSpan={userRole === "Admin" ? 4 : 3}
                  className="text-center border border-black px-4 py-2"
                >
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-2xl font-semibold mb-4">Add New Record</h2>

            <input
              id="input"
              type="text"
              placeholder="First Name"
              value={newRecord.first_name}
              onChange={(e) =>
                setNewRecord({ ...newRecord, first_name: e.target.value })
              }
              className="w-full mb-4 p-2 border border-gray-300 rounded"
            />

            <input
              id="input"
              type="text"
              placeholder="Last Name"
              value={newRecord.last_name}
              onChange={(e) =>
                setNewRecord({ ...newRecord, last_name: e.target.value })
              }
              className="w-full mb-4 p-2 border border-gray-300 rounded"
            />

            <input
              id="input"
              type="text"
              placeholder="Location"
              value={newRecord.location}
              onChange={(e) =>
                setNewRecord({ ...newRecord, location: e.target.value })
              }
              className="w-full mb-4 p-2 border border-gray-300 rounded"
            />

            <div className="flex justify-end space-x-4">
              <button
                id="button"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={handleAddRecord}
              >
                Save
              </button>
              <button
                id="button"
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {editModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-2xl font-semibold mb-4">Edit Record</h2>

            <input
              type="text"
              placeholder="First Name"
              value={editingRecord?.first_name || ""}
              onChange={(e) =>
                setEditingRecord({
                  ...editingRecord,
                  first_name: e.target.value,
                })
              }
              className="w-full mb-4 p-2 border border-gray-300 rounded"
            />

            <input
              type="text"
              placeholder="Last Name"
              value={editingRecord?.last_name || ""}
              onChange={(e) =>
                setEditingRecord({
                  ...editingRecord,
                  last_name: e.target.value,
                })
              }
              className="w-full mb-4 p-2 border border-gray-300 rounded"
            />

            <input
              type="text"
              placeholder="Location"
              value={editingRecord?.location || ""}
              onChange={(e) =>
                setEditingRecord({ ...editingRecord, location: e.target.value })
              }
              className="w-full mb-4 p-2 border border-gray-300 rounded"
            />

            <div className="flex justify-end space-x-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleEditRecord}
              >
                Update
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={() => setEditModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Records;
