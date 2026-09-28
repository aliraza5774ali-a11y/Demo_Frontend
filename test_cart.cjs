const axios = require("axios");

async function testCart() {
  try {
    // 1. login to get token
    const res = await axios.post("http://localhost:5000/api/auth/login", {
      email: "admin@zeescents.com", 
      password: "password123"
    });
    const token = res.data.token;
    console.log("Logged in");

    // 2. Fetch products to get an ID
    const prodRes = await axios.get("http://localhost:5000/api/products");
    const productId = prodRes.data.data[0].id;
    console.log("Product ID:", productId);

    // 3. Add to cart
    const cartRes = await axios.post("http://localhost:5000/api/cart/items", 
      { product_id: productId, quantity: 1 },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("Added to cart:", cartRes.data);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
}
testCart();
