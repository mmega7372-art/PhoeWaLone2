const downloadButtons = document.querySelectorAll(".btn-download");

downloadButtons.forEach((button) => {
  button.addEventListener("click", async (event) => {
    event.preventDefault();

    const originalText = button.innerHTML;
    const fileUrl = button.getAttribute("href");
    const fileName = button.getAttribute("download") || "worksheet.pdf";

    button.classList.add("is-downloading");
    button.textContent = "Downloading…";

    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("The PDF could not be found.");

      const fileBlob = await response.blob();
      const objectUrl = URL.createObjectURL(fileBlob);
      const temporaryLink = document.createElement("a");

      temporaryLink.href = objectUrl;
      temporaryLink.download = fileName;
      temporaryLink.style.display = "none";
      document.body.appendChild(temporaryLink);
      temporaryLink.click();
      temporaryLink.remove();

      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch (error) {
      alert("Download could not start. Please run this website with VS Code Live Server and try again.");
    } finally {
      button.innerHTML = originalText;
      button.classList.remove("is-downloading");
    }
  });
});