// auth/AuthModal.jsx
import { AnimatePresence, motion } from "framer-motion";
import Login from "./Login";
import SignUp from "./SignUp";
import ForgotPassword from "./ForgotPassword";

const AuthModal = ({ view, onClose }) => (
  <AnimatePresence>
    {view && (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"
        >
          {view === "login" ? (
            <Login />
          ) : view === "signUp" ? (
            <SignUp />
          ) : view === "forgotPassword" ? (
            <ForgotPassword />
          ) : null}{" "}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default AuthModal;
