// Fake Data (replace later with backend API)
const courses = [
    { name: "Mathematics", students: 50, capacity: 50 },
    { name: "Physics", students: 30, capacity: 50 },
    { name: "Programming", students: 45, capacity: 50 },
    { name: "Database", students: 50, capacity: 50 },
    { name: "Networks", students: 20, capacity: 40 }
];

function loadCourses() {
    const table = document.getElementById("courseTable");
    table.innerHTML = "";

    courses.forEach(course => {
        let status = course.students >= course.capacity ? "FULL" : "Available";

        let row = `
            <tr>
                <td>${course.name}</td>
                <td>${course.students}</td>
                <td>${course.capacity}</td>
                <td>${status}</td>
            </tr>
        `;

        table.innerHTML += row;
    });
}

loadCourses();

function showSection(sectionId) {
    document.querySelectorAll(".section").forEach(sec => {
        sec.classList.add("hidden");
    });

    document.getElementById(sectionId).classList.remove("hidden");
}

function closeRegistration() {
    alert("Registration Closed Successfully!");
    // Later: send POST request to backend
    // fetch("/admin/close-registration", { method: "POST" })
}

function logout() {
    window.location.href = "index.html";
}