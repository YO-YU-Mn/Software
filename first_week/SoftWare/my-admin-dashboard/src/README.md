# 🎓 Academic Portal — Faculty of Science

## Project Structure

```
AcademicPortal/
└── src/
    ├── App.jsx                        ← Entry point & routing
    ├── theme.js                       ← Colors, gradients, constants
    │
    ├── data/
    │   └── initialData.js             ← Sample courses & students
    │
    ├── hooks/
    │   └── useCountUp.js              ← Animated number count-up hook
    │
    ├── components/
    │   ├── Sparkline.jsx              ← SVG mini chart
    │   ├── KpiCard.jsx                ← Stat card with sparkline
    │   └── DetailPanel.jsx            ← Modal for student/course details
    │
    └── pages/
        ├── Dashboard.jsx              ← Main dashboard with nav cards
        ├── StudentsList.jsx           ← Students table with search/filter
        ├── CoursesList.jsx            ← Course cards + add course form
        ├── Reports.jsx                ← GPA & performance reports
        ├── AddStudentPage.jsx         ← Register student + manage enrollments
        └── AdminFormPage.jsx          ← Password-protected admin registration
```

## Features
- 🎓 Student registration & enrollment management
- 📚 Course capacity tracking with live bars & rings
- 📊 GPA distribution & performance reports
- 🔐 Password-protected admin registration (`password: admin`)
- 🌙 Dark navy theme with animated stats

## Tech
- React (hooks only, no external UI libs)
- Inline styles with shared theme constants
- IBM Plex Mono font
