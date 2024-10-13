import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, CardMedia } from "@mui/material";
import QRCode from 'qrcode';
import { Videos, ChannelCard } from ".";
import { registerAPI } from "../utils/fetchFromAPI";
import { toast } from "react-toastify";

const SignUp = () => {
  const [channelDetail, setChannelDetail] = useState();
  const [videos, setVideos] = useState(null);
  const [isQrScanned, setIsQrScanned] = useState(false) // kiểm tra user đã quét mã QR chưa
  const [qrCode, setQrCode] = useState(null);
  const { id } = useParams();
  useEffect(() => { }, []);
  const navigate = useNavigate();
  const handleQrScanConfirmation = () => {
    setIsQrScanned(true);
    navigate("/login")
  }
  
  const handleRegister = () => {
    const fullName = document.querySelector("#fullName").value;
    const email = document.querySelector("#email").value;
    const pass = document.querySelector("#pass").value;
    const payload = { fullName, email, pass };
    registerAPI(payload)
      .then((result) => {
        console.log(result);
        const secret = result.data.secret;
        // tạo mã QR code
        const otpauth = `otpauth://totp/${email}?secret=${secret}&issuer=node44`;
        QRCode.toDataURL(otpauth)
        .then((qrCodeUrl)=>{
          setQrCode(qrCodeUrl);
          toast.success(result.message);
        })
        .catch()
        // thông báo
        // toast.success(result.message);
        // // chuyển trang sang login
        // navigate("/login");
      })
      .catch((error) => {
        console.log(error);
        console.log(error.response.data.message);
        const message = error.response.data.message

        toast.error(message);
      });
  };
  return (
    <div className="p-5 " style={{ minHeight: "100vh" }}>
      <div className=" d-flex justify-content-center">
        <form className="row g-3 text-white">
          {/* fullname */}
          <div className="col-md-12">
            <label htmlFor="inputEmail4" className="form-label">
              Full name
            </label>
            <input className="form-control" id="fullName" />
          </div>
          {/* email */}
          <div className="col-md-12">
            <label htmlFor="inputEmail4" className="form-label">
              Email
            </label>
            <input type="email" className="form-control" id="email" />
          </div>
          {/* pass */}
          <div className="col-md-12">
            <label htmlFor="inputEmail4" className="form-label">
              Password
            </label>
            <input className="form-control" id="pass" />
          </div>
          {/* button */}
          <div className="col-12">
            <button onClick={handleRegister} type="button" className="btn btn-primary">
              Sign Up
            </button>
          </div>
        </form>
      </div>
       {/* Hiển thị mã QR nếu có */}
       {qrCode && (
        <div className="text-center mt-4">
          <h4>Scan the QR Code with Google Authenticator</h4>
          <img src={qrCode} alt="QR Code" />
          <button
            onClick={handleQrScanConfirmation}
            type="button"
            className="btn btn-success mt-3"
          >
            I've Scanned the QR Code
          </button>
        </div>
      )}
    </div>
  );
};

export default SignUp;
