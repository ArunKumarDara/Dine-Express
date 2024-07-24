import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../../firebase";
import { googleAuth } from "../../apiCalls/user";
import { message } from "antd";

const Oauth = () => {
  const splitDisplayName = (displayName) => {
    const nameParts = displayName.trim().split(" ");
    const firstName = nameParts.slice(0, -1).join(" ");
    const lastName = nameParts.slice(-1).join(" ");
    return {
      firstName,
      lastName,
    };
  };

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const displayName = result.user.displayName;
      const { firstName, lastName } = splitDisplayName(displayName);
      const response = await googleAuth({
        email: result.user.email,
        firstName,
        lastName,
        phoneNumber: result.user.phoneNumber,
      });
      if (response.success) {
        localStorage.setItem("tokenForDineExpress", response.data);
        window.location.href = "/";
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error("could not login with google", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className=" text-gray-400 p-3 uppercase hover:opacity-95 hover:border-gray-600 hover:text-gray-600 w-full mt-3 border border-gray-400 rounded-md"
    >
      continue with google
    </button>
  );
};

export default Oauth;
