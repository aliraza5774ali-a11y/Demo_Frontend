const axios = require("axios");
async function test() {
  try {
    let token;
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        first_name: "Test", last_name: "User", email: "testcart@example.com", password: "password123"
      });
      token = res.data.token;
    } catch(e) {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: "testcart@example.com", password: "password123"
      });
      token = res.data.token;
    }

    const prodRes = await axios.get("http://localhost:5000/api/products");
    const productId = prodRes.data.data[0].id;

    const cartRes = await axios.post("http://localhost:5000/api/cart/items", 
      { product_id: productId, quantity: 1 },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("Success:", cartRes.data);
  } catch (err) {
    console.error("Error:", err.response ? err.response.data : err.message);
  }
}
test();
