import { useEffect, useRef, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import RazorpayPopup from "./Razorpay";
import statesData from "../data/states.json";

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

const Title = styled.h2`
  font-size: 24px;
  margin: 10px 0;
  color: #333;
`;

const InputField = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  border: 1px solid #ddd;
`;

const SubmitButton = styled.button`
  background-color: #ff749e;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  margin-top: 10px;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const SelectField = styled.select`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  border: 1px solid #ddd;
`;

const Form = ({
  phone,
  setShowFormModal,
  countryCode,
  name,
  state,
  setState,
  setName,
  city,
  setCity,
  courseId,
  email,
  amount,
  setEmail,
}) => {
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [countries, setCountries] = useState([]);
  const [stateError, setStateError] = useState("");
  const [countryError, setCountryError] = useState("");
  const [cityError, setCityError] = useState("");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const modalRef = useRef();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("https://countriesnow.space/api/v0.1/countries/positions");
        setCountries(response.data.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  // Fetch states when a country is selected
  useEffect(() => {
    if (!selectedCountry) return;

    const fetchStates = async () => {
      try {
        const response = await axios.post("https://countriesnow.space/api/v0.1/countries/states", {
          country: selectedCountry,
        });
        setStates(response.data.data.states);
        setCities([]); // Reset cities when the country changes
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };

    fetchStates();
  }, [selectedCountry]);

  // Fetch cities when a state is selected
  useEffect(() => {
    if (!state) return;

    const fetchCities = async () => {
      try {
        const response = await axios.post("https://countriesnow.space/api/v0.1/countries/state/cities", {
          country: selectedCountry,
          state: state,
        });
        setCities(response.data.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCities();
  }, [state]);

  const validateCountry = () => {
    if (!selectedCountry.trim()) {
      setCountryError("Country field cannot be empty.");
      return false;
    }
    setCountryError("");
    return true;
  };

  const validateState = () => {
    if (!state.trim()) {
      setStateError("State field cannot be empty.");
      return false;
    }
    setStateError("");
    return true;
  };

  const validateName = () => {
    const nameRegex = /^[a-zA-Z\s]*$/; // Regular expression to allow only letters and spaces
    const trimmedName = name.trim();

    if (!trimmedName || !nameRegex.test(trimmedName)) {
      setNameError("Please enter a valid name.");
      return false;
    }
    setNameError("");
    return true;
  };

  const validateEmail = () => {
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validateCity = () => {
    if (!city.trim()) {
      setCityError("City field cannot be empty.");
      return false;
    }
    setCityError("");
    return true;
  };

  const handleSubmit = async () => {
    if (
      !validateName() ||
      !validateEmail() ||
      !validateCity() ||
      !validateState() ||
      !validateCountry()
    )
      return;
      setShowPaymentPopup(true);
  };

  return (
    <>
      {showPaymentPopup ? (
        <RazorpayPopup
          setShowFormModal={setShowFormModal}
          userName={name} // Replace with actual user details
          email={email}
          mobile={phone}
          city={city}
          state={state}
          country={selectedCountry}
          courseId={courseId}
          userId={localStorage.getItem("user_key")} // Replace with actual userId
          amount={amount * 100} // Amount in smallest currency unit
          currency="INR" // Currency code
        />
      ) : (
        <ModalBackground>
          <ModalContent ref={modalRef}>
            <CloseButton onClick={() => setShowFormModal(false)}>×</CloseButton>
            <Title>Enter Details</Title>

            <InputField
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={validateName}
            />
            {nameError && <p style={{ color: "red" }}>{nameError}</p>}

            <InputField
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={validateEmail}
            />
            {emailError && <p style={{ color: "red" }}>{emailError}</p>}

            <SelectField
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              <option value="">Select Country</option>
              {countries.map((country, index) => (
                <option key={index} value={country.name}>
                  {country.name}
                </option>
              ))}
            </SelectField>
            {countryError && <p style={{ color: "red" }}>{countryError}</p>}

            <SelectField value={state} onChange={(e) => setState(e.target.value)}>
              <option value="">Select State</option>
              {states.map((state, index) => (
                <option key={index} value={state.name}>
                  {state.name}
                </option>
              ))}
            </SelectField>
            {stateError && <p style={{ color: "red" }}>{stateError}</p>}

            <SelectField value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">Select City</option>
              {cities.map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))}
            </SelectField>
            {cityError && <p style={{ color: "red" }}>{cityError}</p>}
            
            <SubmitButton onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </SubmitButton>
          </ModalContent>
        </ModalBackground>
      )}
    </>
  );
};

export default Form;
