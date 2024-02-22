import React from "react";

import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div>
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-600 to-blue-400 border-gray-200 dark:bg-gray-900">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">

          <div className="flex items-center space-x-6 rtl:space-x-reverse">

            <Link
              to="/Login"
              className="text-gray-900 dark:text-white hover:text-gray-600 Black:hover:text-gray-400 transition duration-300"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Navigation Links */}
      <nav className="bg-opacity-50 bg-gray-50 dark:bg-gray-700">
        <div className="max-w-screen-xl px-4 py-3 mx-auto">
          <div className="flex items-center">
            <ul className="flex flex-row font-medium mt-0 space-x-8 rtl:space-x-reverse text-sm">

              <li>
                <Link
                  to="/User"
                  className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-400 transition duration-300"
                >
                  User
                </Link>
              </li>
              <li>
                <Link
                  to="/Student"
                  className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-400 transition duration-300"
                >
                  Student
                </Link>
              </li>
              <li>
                <Link
                  to="/Subject"
                  className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-400 transition duration-300"
                >
                  Subject
                </Link>
              </li>
              <li>
                <Link
                  to="/Teacher"
                  className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-400 transition duration-300"
                >
                  Teacher
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
