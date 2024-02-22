import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import "animate.css";

const Teacher = () => {
    const [teachers, setTeachers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [teachersPerPage] = useState(5);
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [editedFirstName, setEditedFirstName] = useState("");
    const [editedLastName, setEditedLastName] = useState("");
    const [editedAge, setEditedAge] = useState("");
    const [editedSalary, setEditedSalary] = useState("");
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const [newTeacherData, setNewTeacherData] = useState({
        firstName: "",
        lastName: "",
        age: "",
        salary: "",
    });
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const response = await fetch("http://localhost:8000/teachers");
            if (!response.ok) {
                throw new Error("Failed to fetch teachers");
            }
            const data = await response.json();
            setTeachers(data);
        } catch (error) {
            console.error(error);
        }
    };

    const indexOfLastTeacher = currentPage * teachersPerPage;
    const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage;
    const currentTeachers = teachers.slice(indexOfFirstTeacher, indexOfLastTeacher);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleEdit = (teacher) => {
        setEditingTeacher(teacher);
        setEditedFirstName(teacher.FirstName);
        setEditedLastName(teacher.LastName);
        setEditedAge(teacher.Age);
        setEditedSalary(teacher.Salary);
        setModalIsOpen(true);
    };

    const handleCancelEdit = () => {
        setEditingTeacher(null);
        setEditedFirstName("");
        setEditedLastName("");
        setEditedAge("");
        setEditedSalary("");
        setModalIsOpen(false);
    };

    const handleSaveEdit = async () => {
        if (editingTeacher) {
            const updatedTeacher = {
                ...editingTeacher,
                FirstName: editedFirstName,
                LastName: editedLastName,
                Age: editedAge,
                Salary: editedSalary,
            };

            try {
                const response = await fetch(
                    `http://localhost:8000/teachers/${updatedTeacher.ID}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(updatedTeacher),
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to update teacher");
                }

                const updatedTeacherData = await response.json();
                const updatedTeachers = teachers.map((teacher) =>
                    teacher.ID === updatedTeacherData.ID ? updatedTeacherData : teacher
                );

                setTeachers(updatedTeachers);
                setEditingTeacher(null);
                setEditedFirstName("");
                setEditedLastName("");
                setEditedAge("");
                setEditedSalary("");
                toast.success("Teacher information updated successfully");
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleDelete = async (teacherId) => {
        if (isConfirmingDelete) {
            try {
                const response = await fetch(`http://localhost:8000/teachers/${teacherId}`, {
                    method: "DELETE",
                });
                if (!response.ok) {
                    throw new Error("Failed to delete teacher");
                }
                const deletedTeacherId = teacherId;
                const updatedTeachers = teachers.filter((teacher) => teacher.ID !== deletedTeacherId);
                setTeachers(updatedTeachers);
                setIsConfirmingDelete(false);
                toast.success("Teacher deleted successfully");
            } catch (error) {
                console.error(error);
            }
        } else {
            setIsConfirmingDelete(true);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewTeacherData((prevData) => ({
            ...prevData,
            [name]: name === "age" || name === "salary" ? parseInt(value, 10) || "" : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8000/teachers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newTeacherData),
            });
            if (!response.ok) {
                throw new Error("Failed to add teacher");
            }
            const teacherData = await response.json();
            setTeachers([...teachers, teacherData]);
            setNewTeacherData({ firstName: "", lastName: "", age: 0, salary: 0 });
            toast.success("Teacher added successfully");
            setModalIsOpen(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-3xl font-semibold mb-4 animate__animated animate__zoomInDown text-center">
                Teacher List
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
                        onClick={() => setModalIsOpen(true)}
                    >
                        Add Teacher
                    </button>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                First Name
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Last Name
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Age
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Salary
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
                        {currentTeachers.map((teacher) => (
                            <tr key={teacher.ID} className="hover:bg-gray-100">
                                <td className="px-6 py-4 whitespace-nowrap">{teacher.FirstName}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{teacher.LastName}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{teacher.Age}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{teacher.Salary}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <>
                                        <button
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                                            onClick={() => handleEdit(teacher)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                            onClick={() => handleDelete(teacher.ID)}
                                        >
                                            Delete
                                        </button>
                                    </>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => {
                    setModalIsOpen(false);
                    handleCancelEdit();
                }}
                contentLabel={editingTeacher ? "Edit Teacher" : "Add Teacher"}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg"
                overlayClassName="fixed top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-50"
            >
                {editingTeacher ? (
                    <h2 className="text-2xl font-semibold mb-4">Edit Teacher</h2>
                ) : (
                    <h2 className="text-2xl font-semibold mb-4">Add Teacher</h2>
                )}
                <form onSubmit={editingTeacher ? handleSaveEdit : handleSubmit} className="space-y-4">
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                            First Name
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            placeholder="Enter first name"
                            value={editingTeacher ? editedFirstName : newTeacherData.firstName}
                            onChange={(e) =>
                                editingTeacher ? setEditedFirstName(e.target.value) : handleChange(e)
                            }
                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            placeholder="Enter last name"
                            value={editingTeacher ? editedLastName : newTeacherData.lastName}
                            onChange={(e) =>
                                editingTeacher ? setEditedLastName(e.target.value) : handleChange(e)
                            }
                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="age" className="text-sm font-medium text-gray-700">
                            Age
                        </label>
                        <input
                            type="text"
                            id="age"
                            name="age"
                            placeholder="Enter age"
                            value={editingTeacher ? editedAge : newTeacherData.age}
                            onChange={(e) =>
                                editingTeacher ? setEditedAge(e.target.value) : handleChange(e)
                            }
                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="salary" className="text-sm font-medium text-gray-700">
                            Salary
                        </label>
                        <input
                            type="text"
                            id="salary"
                            name="salary"
                            placeholder="Enter salary"
                            value={editingTeacher ? editedSalary : newTeacherData.salary}
                            onChange={(e) =>
                                editingTeacher ? setEditedSalary(e.target.value) : handleChange(e)
                            }
                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex justify-between">
                        <button
                            type="button"
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => {
                                setModalIsOpen(false);
                                handleCancelEdit();
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            {editingTeacher ? "Save" : "Add Teacher"}
                        </button>
                    </div>
                </form>
            </Modal>

            <ToastContainer />
        </div>
    );
};

export default Teacher;
