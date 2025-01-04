import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Send } from "lucide-react";

function Users() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    axios
      .get(`http://localhost:3000/user/bulk?filter=${filter}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setUsers(response.data.users))
      .catch((error) => console.error("Error fetching users:", error));
  }, [filter, navigate]);

  return (
    <>
      <div className="m-2 font-bold mt-6 text-2xl text-black">USERS</div>
      <div className="my-2">
        <input
          onChange={(e) => setFilter(e.target.value)}
          value={filter}
          type="text"
          placeholder="Search users..."
          className="w-full px-2 py-3 border rounded border-slate-200"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* This grid will allow 1 column on small screens, 2 on medium, 3 on larger screens, and 5 on extra large screens */}
        {users.map((user) => (
          <User key={user._id} user={user} />
        ))}
      </div>
    </>
  );
  
  function User({ user }) {
    const navigate = useNavigate();
  
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg shadow-sky-400 flex flex-col items-center">
        <div className="rounded-full h-20 w-20 bg-slate-200 flex justify-center items-center mb-4">
          <div className="text-xl">{user.name[0]}</div>
        </div>
        <div className="text-lg font-semibold mb-4">{user.name}</div>
        <button
          onClick={() => {
            navigate(`/send?id=${user._id}&name=${user.name}`);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Send className="h-4 w-4 mr-1" />
          Send Money
        </button>
      </div>
    );
  }
}
  
  export default Users;
