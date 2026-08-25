const LoadingScreen = () => {
  return (
    <div className="loading-screen" role="status" aria-label="Loading T.Fundi">
      <div className="furniture-loader">
        <div className="furniture-object">
          {/* Backrest */}
          <div className="furniture-part backrest">
            <div className="face front" />
            <div className="face top" />
            <div className="face side" />
          </div>

          {/* T.Fundi branding between backrest and seat */}
          <div className="loading-brand">T.Fundi</div>

          {/* Seat */}
          <div className="furniture-part seat">
            <div className="face front" />
            <div className="face top" />
            <div className="face side" />
          </div>

          {/* Legs */}
          <div className="furniture-part leg leg-1">
            <div className="face front" />
            <div className="face side" />
          </div>

          <div className="furniture-part leg leg-2">
            <div className="face front" />
            <div className="face side" />
          </div>

          <div className="furniture-part leg leg-3">
            <div className="face front" />
            <div className="face side" />
          </div>

          <div className="furniture-part leg leg-4">
            <div className="face front" />
            <div className="face side" />
          </div>
        </div>

        <div className="furniture-ground" />
      </div>

      <div className="loading-copy">
        <div className="loading-message">
          Setting up your workspace
          <span className="loading-dots">...</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;