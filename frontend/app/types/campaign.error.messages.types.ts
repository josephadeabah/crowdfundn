// Add these helper functions at the top of the file
export const getErrorMessage = (errorData: any): string => {
  if (typeof errorData === 'string') return errorData;
  if (errorData.error) return errorData.error;
  if (errorData.details?.length > 0) return errorData.details.join(', ');
  return 'An unknown error occurred';
};

export const getDetailedErrorMessage = (errorData: any): string => {
  if (!errorData) return 'An unknown error occurred';

  let message = '';
  if (errorData.error) message += errorData.error;

  if (errorData.details?.length > 0) {
    message += message ? ': ' : '';
    message += errorData.details.join(', ');
  }

  if (errorData.requirements) {
    const requirements = Object.entries(errorData.requirements)
      .filter(([_, value]) => value === false)
      .map(([key]) => key.replace(/_/g, ' '));

    if (requirements.length > 0) {
      message += message ? '. ' : '';
      message += `Requirements not met: ${requirements.join(', ')}`;
    }
  }

  return message || 'An unknown error occurred';
};
