document.getElementById('leadForm').addEventListener('submit', async function (event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const zip = document.getElementById('zip').value;

  // Proxy URL to handle CORS issues
  const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  const targetUrl = 'https://percallpro.leadportal.com/apiJSON.php';

  // Fetch API Key from environment variable
  const apiKey = 'c366069fb8928731803bc0320714e22c45ae7f674d7ece8fd4fea2d8fa24cbc6';

  // Define the initial payload
  const initialPayload = {
    Request: {
      Key: apiKey,
      API_Action: 'iprSubmitLead',
      TYPE: '35',
      Mode: 'ping',
      Return_Best_Price: '1',
      Return_Min_Duration: '1',
      SRC: 'Zizye_Dynamic',
      Origin_Phone: phone,
      State: 'FL',
      ZIP: zip,
      Terminating_Phone: '7273535323',
      Test_Lead: '1',
      Format: 'JSON',
    },
  };

  try {
    // Send the initial POST request
    const initialResponse = await fetch(`${proxyUrl}${targetUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(initialPayload),
    });

    if (!initialResponse.ok) {
      throw new Error('Initial request failed');
    }

    const initialData = await initialResponse.json();
    console.log('Ping Response:', initialData);

    // Display the Ping response
    const responseElement = document.getElementById('response');
    responseElement.innerHTML = `<p><strong>Ping Response:</strong> ${JSON.stringify(
      initialData
    )}</p>`;

    // Check if the response contains "Matched"
    if (initialData?.response?.status === 'Matched') {
      const leadIdFromResponse = initialData?.response?.lead_id;
      if (!leadIdFromResponse) {
        throw new Error('lead_id not found in the initial response');
      }

      // Prepare the new payload with Mode: post
      const newPayload = {
        Request: {
          Key: apiKey,
          API_Action: 'iprSubmitLead',
          TYPE: '35',
          Mode: 'post',
          Return_Best_Price: '1',
          Return_Min_Duration: '1',
          SRC: 'Zizye_Dynamic',
          Origin_Phone: phone,
          State: 'FL',
          ZIP: zip,
          Terminating_Phone: '7273535323',
          Lead_ID: leadIdFromResponse,
          Format: 'JSON',
        },
      };

      // Send the second POST request
      const secondResponse = await fetch(`${proxyUrl}${targetUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPayload),
      });

      if (!secondResponse.ok) {
        throw new Error('Second request failed');
      }

      const secondData = await secondResponse.json();
      console.log('Post Response:', secondData);

      // Append the Post response
      responseElement.innerHTML += `<p><strong>Post Response:</strong> ${JSON.stringify(
        secondData
      )}</p>`;
    } else {
      responseElement.innerHTML +=
        '<p>Ping response did not match criteria for re-sending the request.</p>';
    }
  } catch (error) {
    console.error('Error:', error);
    document.getElementById(
      'response'
    ).innerHTML = `<p>Error: ${error.message}</p>`;
  }
});
