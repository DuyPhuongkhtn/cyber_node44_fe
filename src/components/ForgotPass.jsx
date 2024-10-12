import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, CardMedia } from "@mui/material";

import { Videos, ChannelCard } from ".";
import { changePassAPI, forgetCheckCodeAPI, forgetCheckMailAPI, loginAPI, loginFacebookAPI } from "../utils/fetchFromAPI";

import { toast } from 'react-toastify';

const ForgetPass = () => {
    const [email, setEmail] = useState(''); // State để lưu email
    const [channelDetail, setChannelDetail] = useState();
    const [videos, setVideos] = useState(null);

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {

    }, []);

    const [step, setStep] = useState(0)

    return <div className="p-5 " style={{ minHeight: "100vh" }}>
        <div className=" d-flex justify-content-center">

            {step == 0 && <form className="row g-3 text-white">
                <div className="col-md-12">
                    <label htmlFor="inputEmail4" className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        onChange={(e) => setEmail(e.target.value)} // Cập nhật giá trị state khi người dùng nhập email
                    />
                </div>

                <div className="col-12">
                    <button type="button" className="btn btn-primary"

                        onClick={() => {
                            let email = document.querySelector("#email").value

                            forgetCheckMailAPI({ email }).then(result => {
                                toast.success("You can check email to recieve code")
                                setStep(1)

                            }).catch(error => {
                                toast.error("Error to forgot password")
                                alert(error.response.data.message)
                            })
                        }}
                    >Next</button>

                </div>

            </form>}

            {step == 1 && <form className="row g-3 text-white">
                <div className="col-md-12">
                    <label htmlFor="inputEmail4" className="form-label">Nhập CODE</label>
                    <input className="form-control" id="code" />
                    <label htmlFor="inputEmail4" className="form-label">Đổi mật khẩu</label>
                    <input className="form-control" id="pass" />
                </div>

                <div className="col-12">
                    <button type="button" className="btn btn-primary"

                        onClick={() => {
                            let code = document.querySelector("#code").value;
                            let newPass = document.querySelector("#pass").value;
                            changePassAPI({code, newPass, email})
                            .then(result => {
                                toast.success("Password changed successfully");
                                navigate("/login"); // Điều hướng về trang đăng nhập
                            })
                            .catch(error => {
                                toast.error(error.response.data.message);
                                console.log(error.response.data.message);
                            });
                        }}
                    >Next</button>

                </div>

            </form>}


        </div>
    </div>
};

export default ForgetPass;