import { useState, useCallback, useEffect } from "react";
import useRazorpay from "react-razorpay";
import axios from "axios";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { useRouter } from "next/router";

const RazorpayPopup = ({
  setShowFormModal,
  userName,
  email,
  mobile,
  city,
  state,
  country,
  courseId,
  userId,
  amount,
  currency,
}) => {
  const [Key, setKey] = useState("");
  const [orderId, setOrderId] = useState("");
  const [Razorpay] = useRazorpay();
  const router = useRouter();
  const [loading, setLoading] = useState(false); // Use loading state for proper management
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const generateOrder = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/createOrder`,
        {
          courseId: courseId,
          userId: userId,
          amount: amount,
          currency: currency,
        }
      );
      setLoading(false);
      if (response.data.status === 200) {
        setKey(response.data.key_id);
        setOrderId(response.data.order_id);
      } else {
        NotificationManager.error(response.data.message, "Error");
      }
    } catch (error) {
      setLoading(false);
      NotificationManager.error(
        "Error fetching data! Please try again!",
        "Error"
      );
    }
  };

  const handlePayment = useCallback(() => {
    if (!Key || !orderId) {
      NotificationManager.error(
        "Order details not set! Please try again!",
        "Error"
      );
      return;
    }
    
    const options = {
      key: Key,
      amount: amount,
      currency: currency,
      name: userName,
      description: "Ecommerce Product Order",
      image: "/Logo_MGPS.png",
      order_id: orderId,
      handler: async function (response) {
        try {
          setLoading(true);

          const customerDetails = {
            userId: userId,
            name: userName,
            email: email,
            mobile: mobile,
            city: city,
            state: state,
            country: country,
            amount: amount / 100, // Ensure this is in the right format
            paymentMode: "Wallet",
          };

          const paymentResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/verify-payment`,
            {
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              customerDetails: customerDetails,
              
              courseId: courseId,
            }
          );
          setLoading(false);
          if (paymentResponse.data.status === 200) {
            NotificationManager.success("Payment Successful!", "Success");
            setShowSuccessPopup(true);
          } else {
            NotificationManager.error(
              paymentResponse.data.message || "Payment verification failed!",
              "Error"
            );
          }
        } catch (error) {
          setLoading(false);
          NotificationManager.error(
            "Error in payment! Please try again!",
            "Error"
          );
          console.error("Error in payment success API call:", error);
        }
      },
      prefill: {
        name: userName,
        email: email,
        contact: mobile,
      },
      theme: {
        color: "#e44672",
      },
    };

    const rzp1 = new Razorpay(options);
    rzp1.on("payment.failed", function (response) {
      NotificationManager.error("Payment failed! Please try again!", "Error");
    });

    NotificationManager.warning(
      "Don't refresh the page until the payment is completed.",
      "",
      10000
    );
    rzp1.open();
  }, [
    Key,
    orderId,
    Razorpay,
    amount,
    currency,
    userName,
    email,
    mobile,
    city,
    state,
    country,
    courseId,
    userId,
  ]);

  useEffect(() => {
    generateOrder();
  }, []);

  useEffect(() => {
    if (Key && orderId) {
      handlePayment();
    }
  }, [Key, orderId, handlePayment]); // Add dependencies

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
    setShowFormModal(false);
    document.body.style.overflow = "auto";
    router.push(`/courses/${courseId}/learn`);
  };

  return (
    <>
      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
          Don't refresh
        </div>
      )}
      <NotificationContainer />
      {showSuccessPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Congratulations!</h2>
            <p>Your payment was successful.</p>
            <button onClick={closeSuccessPopup}>Explore the Course</button>
          </div>
        </div>
      )}
    </>
  );
};

export default RazorpayPopup;
