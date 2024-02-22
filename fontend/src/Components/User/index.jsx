import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import "animate.css";

const User = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [editingUser, setEditingUser] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [newUserData, setNewUserData] = useState({ name: "", email: "" });
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8000/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditedName(user.Name);
    setEditedEmail(user.Email);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditedName("");
    setEditedEmail("");
  };

  const handleSaveEdit = async () => {
    if (editingUser) {
      const updatedUser = {
        ...editingUser,
        Name: editedName,
        Email: editedEmail,
      };
      try {
        const response = await fetch(
          `http://localhost:8000/users/${updatedUser.ID}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedUser),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to update user");
        }
        const updatedUserData = await response.json();
        const updatedUsers = users.map((user) =>
          user.ID === updatedUserData.ID ? updatedUserData : user
        );
        setUsers(updatedUsers);
        setEditingUser(null);
        setEditedName("");
        setEditedEmail("");
        toast.success("User updated successfully");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDelete = async (userId) => {
    if (isConfirmingDelete) {
      try {
        const response = await fetch(`http://localhost:8000/users/${userId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete user");
        }
        const updatedUsers = users.filter((user) => user.ID !== userId);
        setUsers(updatedUsers);
        setIsConfirmingDelete(false);
        toast.success("User deleted successfully");
      } catch (error) {
        console.error(error);
      }
    } else {
      setIsConfirmingDelete(true);
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUserData({ ...newUserData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUserData),
      });
      if (!response.ok) {
        throw new Error("Failed to add user");
      }
      const userData = await response.json();
      setUsers([...users, userData]);
      setNewUserData({ name: "", email: "" });
      toast.success("User added successfully");
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4 bg-gray-100 animate__animated animate__fadeIn">
      <h1 className="text-3xl font-semibold mb-4 text-center">User List</h1>
      <div className="overflow-hidden shadow-md rounded-lg w-full mx-auto bg-white">
        <div className="p-4 bg-blue-500 text-white flex justify-between items-center">
          <h2 className="font-semibold text-lg">Manage Users</h2>
          <button
            onClick={openModal}
            className="bg-green-400 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Add New User
          </button>
        </div>
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {currentUsers.map((user) => (
              <tr className="border-b border-gray-200 hover:bg-gray-100" key={user.ID}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingUser === user ? (
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="border-gray-300 rounded-md w-full"
                    />
                  ) : (
                    user.Name
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingUser === user ? (
                    <input
                      type="text"
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                      className="border-gray-300 rounded-md w-full"
                    />
                  ) : (
                    user.Email
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {editingUser === user ? (
                    <>
                      <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                        onClick={handleSaveEdit}
                      >
                        Save
                      </button>
                      <button
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                        onClick={() => handleEdit(user)}
                      >
                        Edit
                      </button>
                      <button
                        className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ${isConfirmingDelete ? 'hidden' : ''}`}
                        onClick={() => handleDelete(user.ID)}
                      >
                        Delete
                      </button>
                      {isConfirmingDelete && (
                        <>
                          <button
                            className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded mr-2"
                            onClick={() => handleDelete(user.ID)}
                          >
                            Confirm
                          </button>
                          <button
                            className="bg-gray-600 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
                            onClick={() => setIsConfirmingDelete(false)}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-3 bg-white border-t flex justify-center">
          <ul className="flex">
            {Array.from({ length: Math.ceil(users.length / usersPerPage) }, (_, i) => (
              <li key={i} className="mx-1">
                <button
                  onClick={() => paginate(i + 1)}
                  className={`py-2 px-4 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
        overlayClassName="fixed inset-0 bg-black bg-opacity-30"
      >
        <h2 className="font-bold text-lg mb-4">Add New User</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newUserData.name}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="User Name"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={newUserData.email}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="User Email"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Add User
            </button>
            <button
              className="bg-transparent hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default User;
