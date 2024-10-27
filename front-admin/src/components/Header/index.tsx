import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { logout } from '../../state/adminSlice'; // Import logout action
import ConfirmationDialog from '../ConfirmationDialog'; // Import ConfirmationDialog

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleLogout = () => {
<<<<<<< HEAD
    // Dispatch the logout action to clear Redux state
    dispatch(logout());

    // Navigate to the login page after logout
=======
    dispatch(logout());
>>>>>>> upstream/develop
    navigate('/');
  };

  const handleConfirmLogout = () => {
<<<<<<< HEAD
    // Show the confirmation dialog before logout
=======
>>>>>>> upstream/develop
    setShowConfirmDialog(true);
  };

  const handleCancelLogout = () => {
<<<<<<< HEAD
    // Close the confirmation dialog if the user cancels
=======
>>>>>>> upstream/develop
    setShowConfirmDialog(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
<<<<<<< HEAD
        <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
          {/* Left side: Toggle button and logo for small screens */}
          <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
            {/* <!-- Hamburger Toggle BTN --> */}
=======
        <div className="flex w-full items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
          {/* Left side: Toggle button and logo for small screens */}
          <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
>>>>>>> upstream/develop
            <button
              aria-controls="sidebar"
              onClick={(e) => {
                e.stopPropagation();
                props.setSidebarOpen(!props.sidebarOpen);
              }}
              className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
            >
<<<<<<< HEAD
              {/* Icon for Hamburger menu */}
=======
>>>>>>> upstream/develop
              <svg
                className="w-5 h-5 text-black dark:text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>

            <Link className="block flex-shrink-0 lg:hidden" to="/">
              {/* <img src={LogoIcon} alt="Logo" /> */}
            </Link>
          </div>

<<<<<<< HEAD
          {/* Center: Search bar */}
          <div className="hidden lg:flex lg:flex-grow justify-center">
            <input
              type="text"
              placeholder="Search..."
              className="rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Right side: Logout button */}
          <div className="flex items-center gap-3">
=======
          {/* Right side: Logout button */}
          <div className="flex items-center justify-end gap-3 w-full">
>>>>>>> upstream/develop
            <button
              type="button"
              onClick={handleConfirmLogout}
              className="focus:outline-none text-black bg-white hover:bg-gray-200 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-3 py-2 border border-black dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-500"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <ConfirmationDialog
            message="Are you sure you want to logout?"
            confirmButtonLabel="Yes, Logout"
            cancelButtonLabel="Cancel"
            onConfirm={() => {
              handleLogout();
<<<<<<< HEAD
              setShowConfirmDialog(false); // Close the dialog after confirmation
=======
              setShowConfirmDialog(false);
>>>>>>> upstream/develop
            }}
            onCancel={handleCancelLogout}
          />
        </div>
      )}
    </>
  );
};

export default Header;
