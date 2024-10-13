import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { verify2FAAPI } from "../utils/fetchFromAPI"; // Giả định bạn có API để xác minh mã 2FA

const Verify2FA = () => {
  const [code, setCode] = useState(""); // State để lưu mã 2FA
  const navigate = useNavigate();

  const handleVerify = () => {
    verify2FAAPI({ code }) // Gọi API xác minh mã 2FA
      .then((result) => {
        console.log("get result:", result)
        toast.success(result.message);
        navigate("/login"); // Chuyển hướng về trang chính nếu xác minh thành công
      })
      .catch((error) => {
        console.error("Error verifying 2FA: ", error);
        toast.error(error.response.data.message || "Verification failed.");
      });
  };

  return (
    <div className="p-5" style={{ minHeight: "100vh" }}>
      <div className="d-flex justify-content-center">
        <form className="row g-3 text-white" onSubmit={(e) => e.preventDefault()}>
          <div className="col-md-12">
            <label htmlFor="inputCode" className="form-label">Enter 2FA Code</label>
            <input
              type="text"
              className="form-control"
              id="inputCode"
              value={code}
              onChange={(e) => setCode(e.target.value)} // Cập nhật mã 2FA
            />
          </div>
          <div className="col-12">
            <button type="button" className="btn btn-primary" onClick={handleVerify}>
              Verify Code
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Verify2FA;
