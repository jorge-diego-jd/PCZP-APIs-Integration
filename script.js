document.getElementById('leadForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const KEY = "c366069fb8928731803bc0320714e22c45ae7f674d7ece8fd4fea2d8fa24cbc6";
  const firstName = document.getElementById('firstName').value.trim();
  const lastName  = document.getElementById('lastName').value.trim();
  const email     = document.getElementById('email').value.trim();
  const phone     = document.getElementById('phone').value.trim();
  const zip       = document.getElementById('zip').value.trim();
  const dobInput  = document.getElementById('dob').value.trim();  // "YYYY-MM-DD"
  const terminatingPhone = document.getElementById('terminatingPhone').value; // "7273535323"

  // Convert YYYY-MM-DD => MM/DD/YYYY
  let formattedDOB = "";
  if (dobInput) {
    const [year, month, day] = dobInput.split('-');
    formattedDOB = ${month}/${day}/${year};
  }

  const responseDiv = document.getElementById('response');
  responseDiv.innerHTML = ""; // Clear previous logs

  // 1) Build Ping payload
  const pingPayload = {
    Request: {
      Key: KEY,
      API_Action: "iprSubmitLead",
      TYPE: "35",
      Mode: "ping",
      SRC: "Zizye_Dynamic",   // or your specified campaign src
      Return_Best_Price: "1",
      Return_Min_Duration: "1",
      First_Name: firstName,
      Last_Name: lastName,
      Email: email,
      Origin_Phone: phone,
      Terminating_Phone: terminatingPhone,
      ZIP: zip,
      State: "FL",            // many lead portals require State
      DOB: formattedDOB,
      Format: "JSON"
    }
  };

  try {
    console.log("Sending PING:", pingPayload);

    // Ping request
    const pingResp = await fetch('https://aca.allcoveragemedia.com/git-pc-integration/proxy.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pingPayload),
    });
    if (!pingResp.ok) {
      throw new Error("Ping request failed (network error).");
    }

    const pingData = await pingResp.json();
    console.log("Ping Response:", pingData);
    responseDiv.innerHTML += <p><strong>Ping Response:</strong> ${JSON.stringify(pingData)}</p>;

    // Check if matched
    const pingStatus = (pingData?.response?.status || "Unmatched").toLowerCase();
    if (pingStatus !== "matched") {
      responseDiv.innerHTML += <p class="error">Ping was NOT matched. Skipping Post step.</p>;
      return;
    }

    // lead_id from ping
    const leadId = pingData?.response?.lead_id;
    if (!leadId) {
      responseDiv.innerHTML += <p class="error">No lead_id found in Ping response. Cannot Post.</p>;
      return;
    }

    // 2) Build Post payload
    const postPayload = {
      Request: {
        Key: KEY,
        API_Action: "iprSubmitLead",
        TYPE: "35",
        Mode: "post",
        SRC: "Zizye_Dynamic",
        Return_Best_Price: "1",
        Return_Min_Duration: "1",
        Lead_ID: leadId,  // from the ping
        First_Name: firstName,
        Last_Name: lastName,
        Email: email,
        Origin_Phone: phone,
        Terminating_Phone: terminatingPhone,
        ZIP: zip,
        State: "FL",
        DOB: formattedDOB,
        Format: "JSON"
      }
    };

    console.log("Sending POST:", postPayload);

    // Post request
    const postResp = await fetch('https://aca.allcoveragemedia.com/git-pc-integration/proxy.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postPayload),
    });
    if (!postResp.ok) {
      throw new Error("Post request failed (network error).");
    }

    const postData = await postResp.json();
    console.log("Post Response:", postData);

    if (postData?.response?.errors?.error) {
      throw new Error(postData.response.errors.error);
    }

    responseDiv.innerHTML += <p><strong>Post Response:</strong> ${JSON.stringify(postData)}</p>;

  } catch (error) {
    console.error("Error:", error);
    responseDiv.innerHTML += <p class="error">Error: ${error.message}</p>;
  }
});
