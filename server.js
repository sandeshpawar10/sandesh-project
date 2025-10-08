const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";

app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use(express.json());

app.post("/leetcode", async (req, res) => {
  try {
    const response = await axios.post("https://leetcode.com/graphql/", req.body, {
      headers: {
        "Content-Type": "application/json",
        "Referer": "https://leetcode.com",
        "x-requested-with": "XMLHttpRequest",
      },
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Proxy error" });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
