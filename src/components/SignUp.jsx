import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, CardMedia } from "@mui/material";
import QRCode from "qrcode"; // Nhập thư viện QRCode
import { Videos, ChannelCard } from ".";
import { registerAPI } from "../utils/fetchFromAPI";
import { toast } from "react-toastify";

const SignUp = () => {
  const [channelDetail, setChannelDetail] = useState();
  const [videos, setVideos] = useState(null);
  const [qrCode, setQrCode] = useState(null); // State để lưu trữ mã QR
  const [secret, setSecret] = useState(null); // State để lưu trữ secret
  const [isQrScanned, setIsQrScanned] = useState(false); // Trạng thái để kiểm tra xem mã QR đã được quét hay chưa
  const { id } = useParams();
  const handleQrScanConfirmation = () => {
    setIsQrScanned(true); // Đánh dấu rằng mã QR đã được quét
    navigate("/verify-2fa"); // Chuyển hướng sang trang đăng nhập
  };

  useEffect(() => { }, []);
  const navigate = useNavigate();
  const handleRegister = () => {
    const fullName = document.querySelector("#fullName").value;
    const email = document.querySelector("#email").value;
    const pass = document.querySelector("#pass").value;
    const payload = { fullName, email, pass };

    registerAPI(payload)
      .then((data) => {
        console.log(data);
        // thông báo
        const generatedSecret = data.data.secret; // Giả định API trả về secret
        setSecret(generatedSecret);
        // Tạo mã QR từ secret
        const otpauth = `otpauth://totp/${email}?secret=${generatedSecret}&issuer=node44`;
        QRCode.toDataURL(otpauth)
          .then((qrCodeUrl) => {
            setQrCode(qrCodeUrl); // Cập nhật mã QR vào state
            console.log("qrCodeUrl: ", qrCodeUrl)
            toast.success(data.message);

            // Chuyển trang sang login sau khi hiển thị QR code
            // Bạn có thể thêm logic để chờ cho người dùng quét mã QR trước khi chuyển trang
            // navigate("/login"); // Chuyển hướng có thể được thực hiện sau khi người dùng quét mã
          })
          .catch((error) => {
            console.error("Error generating QR code: ", error);
            toast.error("Failed to generate QR code.");
          });

        // toast.success(data.message);

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
          <p>Secret: {secret}</p> {/* Có thể hiển thị secret để sao lưu */}
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
