export const truncateTitle = (title: string, maxLength: number): string => {
  return title.length <= maxLength ? title : `${title.slice(0, maxLength)}...`;
};
