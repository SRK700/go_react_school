import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import "animate.css";

Modal.setAppElement("#root"); // Avoids screen reader issues

const Subject = () => {
    const [subjects, setSubjects] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [subjectsPerPage] = useState(5);
    const [editingSubject, setEditingSubject] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", description: "" });

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

    const handleEdit = (subject) => {
        setEditingSubject(subject);
        setFormData({ name: subject.Name, description: subject.Description });
        setModalIsOpen(true);
    };

    const handleDelete = async (subjectId) => {
        try {
            const response = await fetch(`http://localhost:8000/subjects/${subjectId}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete subject");
            }
            const updatedSubjects = subjects.filter((subject) => subject.ID !== subjectId);
            setSubjects(updatedSubjects);
            toast.success("Subject deleted successfully");
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editingSubject ? "PUT" : "POST";
        const url = editingSubject
            ? `http://localhost:8000/subjects/${editingSubject.ID}`
            : "http://localhost:8000/subjects";

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error(`Failed to ${editingSubject ? "update" : "add"} subject`);
            }
            const subjectData = await response.json();

            if (editingSubject) {
                const updatedSubjects = subjects.map((subject) =>
                    subject.ID === subjectData.ID ? subjectData : subject
                );
                setSubjects(updatedSubjects);
            } else {
                setSubjects([...subjects, subjectData]);
            }

            toast.success(`Subject ${editingSubject ? "updated" : "added"} successfully`);
            closeModal();
        } catch (error) {
            console.error(error);
        }
    };

    const openModal = () => {
        setEditingSubject(null);
        setFormData({ name: "", description: "" });
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setEditingSubject(null);
    };

    return (
        <div className="p-4 animate__animated animate__fadeIn">
            <h1 className="text-3xl font-semibold mb-4 text-center">Subject List</h1>
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg w-4/5 mx-auto animate__animated animate__fadeInUp">
                <div className="flex justify-end p-4">
                    <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        onClick={openModal}
                    >
                        Add Subject
                    </button>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentSubjects.map((subject) => (
                            <tr key={subject.ID} className="hover:bg-gray-100">
                                <td className="px-6 py-4 whitespace-nowrap">{subject.Name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{subject.Description}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                                        onClick={() => handleEdit(subject)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                        onClick={() => handleDelete(subject.ID)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel={editingSubject ? "Edit Subject" : "Add Subject"}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg animate__animated animate__zoomIn"
                overlayClassName="fixed top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-50"
            >
                <h2 className="text-2xl font-semibold mb-4">{editingSubject ? "Edit Subject" : "Add Subject"}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Enter name"
                            value={formData.name}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            placeholder="Enter description"
                            value={formData.description}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            {editingSubject ? "Update Subject" : "Add Subject"}
                        </button>
                    </div>
                </form>
            </Modal>

            <div className="mt-4">
                <ul className="flex justify-center">
                    {Array.from({ length: Math.ceil(subjects.length / subjectsPerPage) }, (_, i) => (
                        <li key={i} className="mx-1">
                            <button
                                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${currentPage === i + 1 ? "bg-blue-700" : ""}`}
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Subject;
