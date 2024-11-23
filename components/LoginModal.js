import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styled from "styled-components";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import countries from "../data/countries.json";

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #f1f1f1;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 300px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #888;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
`;

const CountryCodeSelect = styled.select`
  padding: 10px;
  border-radius: 4px 0 0 4px;
  border: 1px solid #ddd;
  border-right: none;
  width: 40%;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border-radius: 0 4px 4px 0;
  border: 1px solid #ddd;
  width: 90%;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #e75b82;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
`;

const Title = styled.h2`
  font-size: 24px;
  margin: 10px 0;
  color: #333;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #888;
  margin-bottom: 20px;
`;

const Message = styled.p`
  font-size: 14px;
  color: ${(props) => (props.error ? "#e75b82" : "#333")};
  margin-top: 10px;
`;

const LoginModal = ({
  phone,
  setPhone,
  countryCode,
  setCountryCode,
  onClose,
  onLoginSuccess,
  onOtpVerificationSuccess,
}) => {
  const [loading, setLoading] = useState(false);

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpToken, setOtpToken] = useState("");
  const [error, setError] = useState("");

  const modalRef = useRef();

  const handleSendOtp = async () => {
    if (!phone) {
      NotificationManager.error("Phone number cannot be empty.", "Error");
      return;
    }

    if (!/^\d+$/.test(phone)) {
      NotificationManager.error(
        "Invalid phone number. Please enter digits only.",
        "Error"
      );
      return;
    }

    if (phone.length < 7 || phone.length > 14) {
      NotificationManager.error(
        "Phone number must be between 7 and 14 digits.",
        "Error"
      );
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/login`,
        {
          phoneNumber: countryCode + phone,
        }
      );
      if (response.data.status === 201) {
        try {
          onLoginSuccess(response.data.data.token, response.data.data.id);
        } catch (e) {
          console.error("Failed to set localStorage items", e);
        }
        onClose();
      } else if (response.data.status === 200) {
        setOtpSent(true);
        setOtpToken(response.data.data.verification_token);
        NotificationManager.success("OTP sent successfully!", "Success");
      } else {
        NotificationManager.error(response.data.message, "Error");
      }
    } catch (error) {
      console.log(error);
      NotificationManager.error("Failed to send OTP!", "Error");
      setError("Failed to send OTP. Please try again.");
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      NotificationManager.error("OTP cannot be empty!", "Error");
      return;
    }

    if (!/^\d+$/.test(phone)) {
      NotificationManager.error(
        "Invalid OTP! Please enter digits only!",
        "Error"
      );
      return;
    }

    if (otp.length !== 4) {
      NotificationManager.error("OTP must be a 4 digit number!", "Error");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/verify-otp`,
        {
          verification_token: otpToken,
          otp,
        }
      );
      if (response.data.status === 200) {
        setOtpSent(true);
        try {
          setOtpToken(response.data.data.token);
          onLoginSuccess(response.data.data.token, response.data.data.id);
          onOtpVerificationSuccess();
          onClose();
        } catch (e) {
          console.error("Failed to set localStorage items", e);
        }
      } else if (response.data.status === 500) {
        NotificationManager.error("Failed to verify OTP!", "Error");
      } else {
        NotificationManager.error("Invalid OTP!", "Error");
      }
    } catch (error) {
      // console.error("Failed to verify OTP", error);
      NotificationManager.error("Failed to verify OTP!", "Error");
      setError("Failed to verify OTP. Please try again.");
    }
    setLoading(false);
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/community-login`,
        { country_code: countryCode, phone }
      );
      if (response.data.status === 200) {
        setOtpSent(true);
        setOtpToken(response.data.token);
        NotificationManager.success("OTP resent successfully!", "Success");
      } else {
        NotificationManager.error(response.data.message, "Error");
      }
    } catch (error) {
      NotificationManager.error("Failed to resend OTP!", "Error");
      setError("Failed to resend OTP. Please try again.");
    }
    setLoading(false);
  };

  return (
    <ModalBackground>
      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}
      <ModalContent ref={modalRef}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <Title>Login</Title>
        <Subtitle></Subtitle>
        {!otpSent ? (
          <>
            <InputGroup>
              <CountryCodeSelect
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
              >
                {countries.map((country, index) => (
                  <option key={index} value={country.dialCode}>
                    +{country.dialCode} {country.name}
                  </option>
                ))}
              </CountryCodeSelect>
              <Input
                type="text"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </InputGroup>
            <Button onClick={handleSendOtp}>Submit</Button>
          </>
        ) : (
          <>
            <Input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => {
                const value = e.target.value;
                // Use a regular expression to allow only numbers
                if (/^\d*$/.test(value)) {
                  setOtp(value);
                }
              }}
              maxLength={4}
            />
            <div>
              <Button onClick={handleVerifyOtp}>Verify OTP</Button>
              <Button onClick={handleResendOtp}>Resend OTP</Button>
            </div>
          </>
        )}
      </ModalContent>
      <NotificationContainer />
    </ModalBackground>
  );
};

export default LoginModal;
