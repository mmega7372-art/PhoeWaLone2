document.addEventListener("DOMContentLoaded", async () => {
    // 1. Get Transaction ID or User Session Info
    const urlParams = new URLSearchParams(window.location.search);
    const transactionId = urlParams.get('transaction_id') || localStorage.getItem('transaction_id') || 1;

    try {
        // 2. Fetch Progress from DB API
        const response = await fetch(`/api/progress/writing?transaction_id=${transactionId}`);
        if (!response.ok) throw new Error("Failed to load progress data");
        
        const data = await response.json();
        
        const completedCourses = data.completedCourses || []; // e.g., ['COURSE_1', 'COURSE_3']
        const percentage = data.percentage || 0;

        // 3. Update Progress Bar UI
        const progressBar = document.getElementById("global-progress-bar");
        const progressText = document.getElementById("global-progress-text");

        if (progressBar) progressBar.style.width = `${percentage}%`;
        if (progressText) progressText.textContent = `${percentage}% Completed`;

        // 4. Update Course Cards UI
        for (let i = 1; i <= 8; i++) {
            const courseKey = `COURSE_${i}`;
            const courseBtn = document.getElementById(`course-link-${i}`);
            const courseCard = document.getElementById(`course-card-${i}`);

            if (courseBtn && completedCourses.includes(courseKey)) {
                // Style as Completed Course
                courseBtn.textContent = "Completed ✓";
                courseBtn.style.background = "#22c55e"; // Green indicator
                courseBtn.style.color = "#ffffff";
                
                if (courseCard) {
                    courseCard.style.borderColor = "#86efac";
                }
            }
        }
    } catch (error) {
        console.error("Error connecting to progress database:", error);
    }
});