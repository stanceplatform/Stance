export const getApiErrorMessage = (err) => {
  if (err?.status === 401) {
    return 'You have been logged out. Please login again.';
  }

  return (
    err?.data?.message ||
    err?.data?.error ||
    err?.message ||
    'Something went wrong. Please try again.'
  );
};
