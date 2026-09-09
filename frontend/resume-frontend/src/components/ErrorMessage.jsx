function ErrorMessage({ message, onRetry }) {
  if (!message) {
    return null;
  }

  return (
    <div className="error-message">
      <div>
        <strong>Something went wrong</strong>
        <p>{message}</p>
      </div>

      {onRetry && (
        <button onClick={onRetry} className="retry-button">
          Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;