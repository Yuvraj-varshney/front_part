import { Cancel, Room } from "@material-ui/icons";
import axios from "axios";
import { useRef, useState } from "react";
import "./login.css";
import { useNavigate } from 'react-router-dom';

export default function Login({ setShowLogin,myStorage,setCurrentUsername}) {
  const [error, setError] = useState(false);
  const usernameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };
    // console.log(user);
    try {
      const res = await axios.post("/users/login",user);
      
      //   console.log(res);
      myStorage.setItem("user", res.data.username);
     setCurrentUsername(res.data.username);
       
       setShowLogin(false)
      setError(false);

    

    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="loginContainer">
      <div className="logo">
        <Room className="logoIcon" />
        <span>MAPMARKER</span>
      </div>
      <form onSubmit={handleSubmit}>
        <input style={{marginTop:30}} placeholder="username" ref={usernameRef} />
        <input
          // type="password"
          // min="6"
          
         placeholder="password"
          ref={passwordRef}
        />
        <button className="loginBtn" >
          Login
        </button>
        {error && <span className="failure">Something went wrong!</span>}
      </form>
      <Cancel className="loginCancel" onClick={() => setShowLogin(false)} />
    </div>
  );
}