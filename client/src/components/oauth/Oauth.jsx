import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../../firebase";

const Oauth = () => {
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      console.log(result);
    } catch (error) {
      console.log("could not login with google", error);
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
