import React from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [formDtata, setFormData] = React.useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const onSubmit = async () => {
    try {
      const BASE_URL = process.env.REACT_APP_BASE_URL;
      const res = await axios.post(`${BASE_URL}/login`, {
        data: {
          ...formDtata,
        },
      });
      console.log(res.data);
      const TOKEN = res.data.token;
      console.log(TOKEN);
      localStorage.setItem("TOKEN", TOKEN);
      navigate(`/user/${formDtata.email}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <form
        action=""
        className=" w-[300px] flex flex-col gap-4 bg-white rounded p-4"
      >
        <h2 className=" font-bold">Login*</h2>
        <label htmlFor="">Email*</label>
        <input
          required
          value={formDtata.email}
          onChange={(e) =>
            setFormData((data) => {
              return {
                ...data,
                email: e.target.value,
              };
            })
          }
          type="Email"
          className=" outline outline-2 outline-black rounded-sm p-1"
        />
        <label htmlFor="">Password*</label>
        <input
          required
          type="password"
          className=" outline outline-2 outline-black rounded-sm p-1"
          value={formDtata.password}
          onChange={(e) =>
            setFormData((data) => {
              return {
                ...data,
                password: e.target.value,
              };
            })
          }
        />
        {/* <input type="password" /> */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="bg-red-500 text-white py-2 rounded"
        >
          Submit
        </button>

        <hr className="  border-2 border-black" />

        <label htmlFor="">
          <Link to={"/signup"} className="text-purple-800 pr-2">
            Signup
          </Link>
          Instead
        </label>
      </form>
    </div>
  );
};

export default Login;
