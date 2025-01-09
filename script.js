document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#leadForm");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Collect form data
        const formData = new FormData(form);
        const jsonData = {};
        formData.forEach((value, key) => {
            jsonData[key] = value;
        });

        try {
            // Send data to your proxy URL
            const response = await fetch('https://aca.allcoveragemedia.com/git-pc-integration/proxy.php', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(jsonData),
            });

            // Parse the response
            const data = await response.json();

            if (response.ok) {
                alert(`Lead submitted successfully!\nResponse: ${JSON.stringify(data)}`);
            } else {
                throw new Error(data.error || "Unknown error occurred");
            }
        } catch (error) {
            console.error("Error:", error);
            alert(`Error: ${error.message}`);
        }
    });
});
