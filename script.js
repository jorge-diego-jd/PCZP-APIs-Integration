document.getElementById("leadForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const apiUrl = "https://percallpro.leadportal.com/new_api/index.php?action=iprSubmitLead&func=iprSubmitLead&TYPE=35";
    const apiKey = "c366069fb8928731803bc0320714e22c45ae7f674d7ece8fd4fea2d8fa24cbc6";

    // Collect form data
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const zip = document.getElementById("zip").value;
    const leadId = document.getElementById("leadId").value;

    // Construct the payload
    const payload = {
        action: "iprSubmitLead",
        func: "iprSubmitLead",
        TYPE: 35,
        api_key: apiKey,
        SRC: "Zizye_Dynamic",
        Return_Best_Price: 1,
        name,
        email,
        phone,
        zip,
        leadId
    };

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            const result = await response.json();
            document.getElementById("response").innerHTML = `<p>Response: ${JSON.stringify(result)}</p>`;
        } else {
            document.getElementById("response").innerHTML = `<p>Error: Failed to submit the lead. HTTP Status ${response.status}</p>`;
        }
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("response").innerHTML = `<p>Error: ${error.message}</p>`;
    }
});
