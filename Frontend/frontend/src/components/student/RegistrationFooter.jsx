function RegistrationFooter({ selectedCourses, totalHours, loading, onSubmit, disabled }) {
  return (
    <div className="registration-footer">
      <div className="selected-summary">
        <div className="selected-count">
          <span className="count-number">{selectedCourses.length}</span>
          <span>Selected Subjects </span>
        </div>
        <div className="total-hours-footer">
           Total Hours: {totalHours}/18
        </div>
      </div>

      <button
        className="btn-submit"
        onClick={() => {
          console.log("Submit button clicked with", selectedCourses.length, "courses");
          onSubmit();
        }}
        disabled={loading || selectedCourses.length === 0 || disabled}
        title={selectedCourses.length === 0 ? "Select at least one course" : disabled ? "Registration is closed" : "Click to confirm registration"}
      >
        {loading ? (
          <>
            <span className="loading-spinner"></span>
             Saving...
          </>
        ) : (
          <>
            <span>✅</span>
             Confirm Register
          </>
        )}
      </button>
    </div>
  );
}

export default RegistrationFooter;