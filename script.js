document.getElementById('leadForm').addEventListener('submit', async function (event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const zip = document.getElementById('zip').value;
  const leadId = document.getElementById('leadId').value;

  const payload = {
    api_key: "c366069fb8928731803bc0320714e22c45ae7f674d7ece8fd4fea2d8fa24cbc6",
    SRC: "Zizye_Dynamic",
    Return_Best_Price: 1,
    name,
    email,
    phone,
    zip,
    lead_id: leadId,
  };

  try {
    const response = await fetch('https://cors-anywhere.herokuapp.com/https://percallpro.leadportal.com/new_api/index.php?action=iprSubmitLead&func=iprSubmitLead&TYPE=35', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    document.getElementById('response').innerText = `Response: ${JSON.stringify(data)}`;
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('response').innerText = `Error: ${error.message}`;
  }
});
