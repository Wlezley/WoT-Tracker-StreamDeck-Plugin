function authenticateWGAPI() {
    const application_id = document.querySelector('[setting="application_id"]').value;
    if (!application_id) {
        alert("Error WG API ID is empty.");
        return;
    }
    SDPIComponents.streamDeckClient.setGlobalSettings({
        command: "startAuth",
        application_id: application_id
    });
}
