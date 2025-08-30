// api/bfhl.js

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Support both environments: Vercel may provide req.body; otherwise parse manually
    let body = req.body;
    if (!body) {
      try {
        body = await new Promise((resolve, reject) => {
          let raw = "";
          req.on("data", chunk => (raw += chunk));
          req.on("end", () => {
            try {
              resolve(raw ? JSON.parse(raw) : {});
            } catch (e) {
              reject(e);
            }
          });
          req.on("error", reject);
        });
      } catch (e) {
        return res.status(400).json({ is_success: false, message: "Invalid JSON" });
      }
    }

    const { data } = body;

    // fixed info (replace with your details)
    const full_name = "John Doe"; // replace with your full name
    const dob = "17091999"; // replace with your DOB (ddmmyyyy)
    const email = "john@xyz.com"; // replace with your email
    const roll_number = "ABCD123"; // replace with your roll number

    if (!Array.isArray(data)) {
      return res.status(400).json({
        is_success: false,
        user_id: `${full_name.toLowerCase().replace(/\s+/g, "_")}_${dob}`,
        message: "data must be an array"
      });
    }

    // classify elements
    const numbers = data.filter(el => /^[0-9]+$/.test(el));
    const alphabets = data.filter(el => /^[a-zA-Z]+$/.test(el));
    const specials = data.filter(el => !/^[a-zA-Z0-9]+$/.test(el));

    // even/odd as strings
    const even_numbers = numbers.filter(n => parseInt(n) % 2 === 0);
    const odd_numbers = numbers.filter(n => parseInt(n) % 2 !== 0);

    // sum as string
    const sum = numbers.reduce((acc, n) => acc + parseInt(n), 0).toString();

    // uppercase alphabets
    const alphabetsUpper = alphabets.map(a => a.toUpperCase());

    // concat_string: reverse join + alternating caps
    const reversed = alphabets.join("").split("").reverse().join("");
    let concat_string = "";
    for (let i = 0; i < reversed.length; i++) {
      concat_string += i % 2 === 0 ? reversed[i].toUpperCase() : reversed[i].toLowerCase();
    }

    res.status(200).json({
      is_success: true,
      user_id: `${full_name.toLowerCase().replace(/\s+/g, "_")}_${dob}`,
      email,
      roll_number,
      odd_numbers,
      even_numbers,
      alphabets: alphabetsUpper,
      special_characters: specials,
      sum,
      concat_string
    });
  } else {
    res.status(200).json({ message: "API is working 🚀. Use POST /api/bfhl with JSON body to get full output." });
  }
}
