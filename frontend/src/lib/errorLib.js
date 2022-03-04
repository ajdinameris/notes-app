import * as Sentry from "@sentry/browser";
// import config from "../config";

const isLocal = process.env.NODE_ENV === "development";

export function initSentry() {
  if (isLocal) {
    return;
  }

  Sentry.init({
	dsn: "https://b9d937ef67d64add827b3663f6f65295@o1154996.ingest.sentry.io/6235112",
  });
}

export function logError(error, errorInfo = null) {
  if (isLocal) {
    return;
  }

  Sentry.withScope((scope) => {
    errorInfo && scope.setExtras(errorInfo);
    Sentry.captureException(error);
  });
}

export function onError(error) {
	let errorInfo = {};
	let message = error.toString();
  
	// Auth errors
	if (!(error instanceof Error) && error.message) {
	  errorInfo = error;
	  message = error.message;
	  error = new Error(message);
	  // API errors
	} else if (error.config && error.config.url) {
	  errorInfo.url = error.config.url;
	}
  
	logError(error, errorInfo);
  
	alert(message);
  }