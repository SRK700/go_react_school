import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import "animate.css";

const Student = () => {
    const [students, setStudents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [studentsPerPage] = useState(5);
    const [editingStudent, setEditingStudent] = useState(null);
    const [editedFirstName, setEditedFirstName] = useState("");
    const [editedLastName, setEditedLastName] = useState("");
    const [editedAge, setEditedAge] = useState("");
    const [editedGrade, setEditedGrade] = useState("");
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const [newStudentData, setNewStudentData] = useState({
        firstName: "",
        lastName: "",
        age: "",  // Initialize age as a string
        grade: "",
    });

    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await fetch("http://localhost:8000/students");
            if (!response.ok) {
                throw new Error("Failed to fetch students");
            }
            const data = await response.json();
            setStudents(data);
        } catch (error) {
            console.error(error);
        }
    };

    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleEdit = (student) => {
        setEditingStudent(student);
        setEditedFirstName(student.first_name);
        setEditedLastName(student.last_name);
        setEditedAge(student.age);
        setEditedGrade(student.grade);
    };

    const handleCancelEdit = () => {
        setEditingStudent(null);
        setEditedFirstName("");
        setEditedLastName("");
        setEditedAge("");
        setEditedGrade("");
    };

    const handleSaveEdit = async () => {
        if (editingStudent) {
            const updatedStudent = {
                ...editingStudent,
                first_name: editedFirstName,
                last_name: editedLastName,
                age: editedAge,
                grade: editedGrade,
            };
            try {
                const response = await fetch(
                    `http://localhost:8000/students/${updatedStudent.id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(updatedStudent),
                    }
                );
                if (!response.ok) {
                    throw new Error("Failed to update student");
                }
                const updatedStudentData = await response.json();
                const updatedStudents = students.map((student) =>
                    student.id === updatedStudentData.id ? updatedStudentData : student
                );
                setStudents(updatedStudents);
                setEditingStudent(null);
                setEditedFirstName("");
                setEditedLastName("");
                setEditedAge("");
                setEditedGrade("");
                toast.success("การแก้ไขข้อมูลเสร็จสมบูรณ์");
            } catch (error) {
                console.error(error);
            }
        }
    };


    const handleDelete = async (studentId) => {
        if (isConfirmingDelete) {
            try {
                const response = await fetch(
                    `http://localhost:8000/students/${studentId}`,
                    {
                        method: "DELETE",
                    }
                );
                if (!response.ok) {
                    throw new Error("Failed to delete student");
                }
                const deletedStudentId = studentId;
                const updatedStudents = students.filter(
                    (student) => student.id !== deletedStudentId
                );
                setStudents(updatedStudents);
                setIsConfirmingDelete(false);
                toast.success("ลบข้อมูลนักเรียนเรียบร้อยแล้ว");
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
        const newValue = name === "age" ? parseInt(value, 10) : value;
        setNewStudentData({ ...newStudentData, [name]: newValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8000/students", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newStudentData),
            });

            if (!response.ok) {
                throw new Error("Failed to add student");
            }

            const studentData = await response.json();
            setStudents([...students, studentData]);
            setNewStudentData({
                firstName: "",
                lastName: "",
                age: "",
                grade: "",
            });
            toast.success("เพิ่มข้อมูลนักเรียนเรียบร้อยแล้ว");
            closeModal();
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };



    return (
        <div className="p-4">
            <h1 className="text-3xl font-semibold mb-4 animate__animated animate__zoomInDown text-center">
                Student List
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
                        เพิ่ม
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
                                Grade
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
                        {currentStudents.map((row) => (
                            <tr key={row.ID} className="hover:bg-gray-100">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingStudent === row ? (
                                        <input
                                            type="text"
                                            value={editedFirstName}
                                            onChange={(e) => setEditedFirstName(e.target.value)}
                                            className="border-gray-300 rounded-md w-full"
                                        />
                                    ) : (
                                        row.FirstName
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingStudent === row ? (
                                        <input
                                            type="text"
                                            value={editedLastName}
                                            onChange={(e) => setEditedLastName(e.target.value)}
                                            className="border-gray-300 rounded-md w-full"
                                        />
                                    ) : (
                                        row.LastName
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingStudent === row ? (
                                        <input
                                            type="text"
                                            value={editedAge}
                                            onChange={(e) => setEditedAge(e.target.value)}
                                            className="border-gray-300 rounded-md w-full"
                                        />
                                    ) : (
                                        row.Age
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingStudent === row ? (
                                        <input
                                            type="text"
                                            value={editedGrade}
                                            onChange={(e) => setEditedGrade(e.target.value)}
                                            className="border-gray-300 rounded-md w-full"
                                        />
                                    ) : (
                                        row.Grade
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingStudent === row ? (
                                        <>
                                            <button
                                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                                                onClick={handleSaveEdit}
                                            >
                                                บันทึก
                                            </button>
                                            <button
                                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2"
                                                onClick={handleCancelEdit}
                                            >
                                                ยกเลิก
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            {isConfirmingDelete ? null : (
                                                <button
                                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                                                    onClick={() => handleEdit(row)}
                                                >
                                                    แก้ไข
                                                </button>
                                            )}
                                            {isConfirmingDelete ? (
                                                <>
                                                    <button
                                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                                                        onClick={() => handleDelete(row.ID)}
                                                    >
                                                        ยืนยัน
                                                    </button>
                                                    <button
                                                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                                        onClick={() => setIsConfirmingDelete(false)}
                                                    >
                                                        ยกเลิก
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    className="bg-red-500 hover.bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                                                    onClick={() => handleDelete(row.ID)}
                                                >
                                                    ลบ
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
                contentLabel="เพิ่มข้อมูล"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg"
                overlayClassName="fixed top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-50"
            >
                <h2 className="text-2xl font-semibold mb-4">เพิ่มข้อมูล</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col space-y-2">
                        <label
                            htmlFor="firstName"
                            className="text-sm font-medium text-gray-700"
                        >
                            First Name
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            placeholder="Enter first name"
                            value={newStudentData.firstName}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label
                            htmlFor="lastName"
                            className="text-sm font-medium text-gray-700"
                        >
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            placeholder="Enter last name"
                            value={newStudentData.lastName}
                            onChange={handleChange}
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
                            value={newStudentData.age}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label
                            htmlFor="grade"
                            className="text-sm font-medium text-gray-700"
                        >
                            Grade
                        </label>
                        <input
                            type="text"
                            id="grade"
                            name="grade"
                            placeholder="Enter grade"
                            value={newStudentData.grade}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        เพิ่ม
                    </button>
                </form>
            </Modal>

            <div className="mt-4">
                <ul className="flex justify-center">
                    {Array.from({ length: Math.ceil(students.length / studentsPerPage) }).map(
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

export default Student;
