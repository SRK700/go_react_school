import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import "animate.css";

const Subject = () => {
    const [subjects, setSubjects] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [subjectsPerPage] = useState(5);
    const [editingSubject, setEditingSubject] = useState(null);
    const [editedName, setEditedName] = useState("");
    const [editedDescription, setEditedDescription] = useState("");
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const [newSubjectData, setNewSubjectData] = useState({ name: "", description: "" });
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            const response = await fetch("http://localhost:8000/subjects");
            if (!response.ok) {
                throw new Error("Failed to fetch subjects");
            }
            const data = await response.json();
            setSubjects(data);
        } catch (error) {
            console.error(error);
        }
    };

    const indexOfLastSubject = currentPage * subjectsPerPage;
    const indexOfFirstSubject = indexOfLastSubject - subjectsPerPage;
    const currentSubjects = subjects.slice(indexOfFirstSubject, indexOfLastSubject);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleEdit = (subject) => {
        setEditingSubject(subject);
        setEditedName(subject.Name);
        setEditedDescription(subject.Description);
    };

    const handleCancelEdit = () => {
        setEditingSubject(null);
        setEditedName("");
        setEditedDescription("");
    };

    const handleSaveEdit = async () => {
        if (editingSubject) {
            const updatedSubject = {
                ...editingSubject,
                Name: editedName,
                Description: editedDescription,
            };
            try {
                const response = await fetch(`http://localhost:8000/subjects/${updatedSubject.ID}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedSubject),
                });
                if (!response.ok) {
                    throw new Error("Failed to update subject");
                }
                const updatedSubjectData = await response.json();
                const updatedSubjects = subjects.map((subject) =>
                    subject.ID === updatedSubjectData.ID ? updatedSubjectData : subject
                );
                setSubjects(updatedSubjects);
                setEditingSubject(null);
                setEditedName("");
                setEditedDescription("");
                toast.success("Subject updated successfully");
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleDelete = async (subjectId) => {
        if (isConfirmingDelete) {
            try {
                const response = await fetch(`http://localhost:8000/subjects/${subjectId}`, {
                    method: "DELETE",
                });
                if (!response.ok) {
                    throw new Error("Failed to delete subject");
                }
                const deletedSubjectId = subjectId;
                const updatedSubjects = subjects.filter((subject) => subject.ID !== deletedSubjectId);
                setSubjects(updatedSubjects);
                setIsConfirmingDelete(false);
                toast.success("Subject deleted successfully");
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
        setNewSubjectData({ ...newSubjectData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8000/subjects", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newSubjectData),
            });
            if (!response.ok) {
                throw new Error("Failed to add subject");
            }
            const subjectData = await response.json();
            setSubjects([...subjects, subjectData]);
            setNewSubjectData({ name: "", description: "" });
            toast.success("Subject added successfully");
            closeModal();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-3xl font-semibold mb-4 animate__animated animate__zoomInDown text-center">
                Subject List
            </h1>
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg w-4/5 mx-auto">
                <div className="flex justify-evenly">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
                        onClick={openModal}
                    >
                        Add
                    </button>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Name
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Description
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentSubjects.map((row) => (
                            <tr key={row.ID} className="hover:bg-gray-100">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingSubject === row ? (
                                        <input
                                            type="text"
                                            value={editedName}
                                            onChange={(e) => setEditedName(e.target.value)}
                                            className="border-gray-300 rounded-md w-full"
                                        />
                                    ) : (
                                        row.Name
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingSubject === row ? (
                                        <input
                                            type="text"
                                            value={editedDescription}
                                            onChange={(e) => setEditedDescription(e.target.value)}
                                            className="border-gray-300 rounded-md w-full"
                                        />
                                    ) : (
                                        row.Description
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingSubject === row ? (
                                        <>
                                            <button
                                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                                                onClick={handleSaveEdit}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2"
                                                onClick={handleCancelEdit}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            {isConfirmingDelete ? null : (
                                                <button
                                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                                                    onClick={() => handleEdit(row)}
                                                >
                                                    Edit
                                                </button>
                                            )}
                                            {isConfirmingDelete ? (
                                                <>
                                                    <button
                                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                                                        onClick={() => handleDelete(row.ID)}
                                                    >
                                                        Confirm
                                                    </button>
                                                    <button
                                                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                                        onClick={() => setIsConfirmingDelete(false)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                                                    onClick={() => handleDelete(row.ID)}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Add Subject"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg"
                overlayClassName="fixed top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-50"
            >
                <h2 className="text-2xl font-semibold mb-4">Add Subject</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Enter name"
                            value={newSubjectData.name}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label
                            htmlFor="description"
                            className="text-sm font-medium text-gray-700"
                        >
                            Description
                        </label>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            placeholder="Enter description"
                            value={newSubjectData.description}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Add
                    </button>
                </form>
            </Modal>

            <div className="mt-4">
                <ul className="flex justify-center">
                    {Array.from({ length: Math.ceil(subjects.length / subjectsPerPage) }).map(
                        (_, index) => (
                            <li key={index}>
                                <button
                                    className="bg-blue-500 hover:bg-blue-800 text-gray-800 font-semibold py-2 px-4 mx-1 rounded"
                                    onClick={() => paginate(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            </li>
                        )
                    )}
                </ul>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Subject;
