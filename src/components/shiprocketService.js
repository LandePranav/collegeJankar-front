import axios from "axios";

const API_KEY = process.env.SHIPROCKET_KEY;
const BASE_URL = "https://apiv2.shiprocket.in/v1/external";

const shiprocketApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
});

// Function to create an order
export const createOrder = async (orderData) => {
  try {
    const response = await shiprocketApi.post("/orders/create/adhoc", orderData);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error.response?.data || error.message);
    throw error;
  }
};

// Function to fetch shipping rates
export const getShippingRates = async (orderId) => {
  try {
    const response = await shiprocketApi.get(`/courier/serviceability/?order_id=${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching shipping rates:", error.response?.data || error.message);
    throw error;
  }
};

// Function to track shipment
export const trackShipment = async (shipmentId) => {
  try {
    const response = await shiprocketApi.get(`/courier/track/shipment/${shipmentId}`);
    return response.data;
  } catch (error) {
    console.error("Error tracking shipment:", error.response?.data || error.message);
    throw error;
  }
};