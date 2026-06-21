

async function testMonime() {
  const SPACE_ID = "spc-k6S8Rnhfn3LK5PT9SDEVUyXB9Zi";
  const API_KEY = "mon_test_LvtPPIM1wEswpuo8e3630Vdn5UJO0LxYl3vP1JcSUCcYQyhzOUW8GMS7Do8PvYoB";
  
  const payload = {
    name: "Payment for beat license",
    amount: {
      currency: "SLE",
      value: 600
    }
  };

  try {
    const response = await fetch("https://api.monime.io/v1/payment-codes", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": "test12345",
        "Monime-Space-Id": SPACE_ID
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

testMonime();
