

async function testMonime() {
  const SPACE_ID = "spc-k6S8Rnhfn3LK5PT9SDEVUyXB9Zi";
  const API_KEY = "mon_wLDMWaLDFTHwRkpvWTTbBCxbP4Qh7yCKvf1it2ZqlN1N0i5NZ8m2jUNOPd32OoJ9";
  
  const payload = {
    name: "Payment for beat license",
    lineItems: [
      {
        type: "custom",
        name: "Beat Name",
        price: {
          currency: "SLE",
          value: 600
        },
        quantity: 1
      }
    ]
  };

  try {
    const response = await fetch("https://api.monime.io/v1/checkout-sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `test-${Date.now()}`,
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
