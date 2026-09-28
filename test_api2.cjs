const axios = require("axios");
async function test() {
  try {
    const ts = Date.now();
    const res = await axios.post("http://localhost:5000/api/auth/register", {
      first_name: "Test", last_name: "User", email: `test_${ts}@example.com`, password: "password123"
    });
    const token = res.data.token;

    const prodRes = await axios.get("http://localhost:5000/api/products");
    const productId = prodRes.data.data[0].id;

    const cartRes = await axios.post("http://localhost:5000/api/cart/items", 
      { product_id: productId, quantity: 1 },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("Cart Response:", cartRes.data);
  } catch (err) {
    console.error("API Error:", err.response ? err.response.data : err.message);
  }
}
test();
