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
        onClick={onSubmit}
        disabled={loading || selectedCourses.length === 0 || disabled}
      >
        {loading ? (
          <>
            <span className="loading-spinner"></span>
             Saving...
          </>
        ) : (
          <>
            <span></span>
             Confirm Register
          </>
        )}
      </button>
    </div>
  );
}

export default RegistrationFooter;