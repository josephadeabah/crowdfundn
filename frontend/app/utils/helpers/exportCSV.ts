import { toast } from 'react-toastify';

export const exportUsersToCSV = async (fetchAllUsers: Function) => {
  try {
    const { users } = await fetchAllUsers(1, 60); // Fetch all users (adjust limit if needed)

    if (!users || users.length === 0) {
      toast.info('No users to export');
      return;
    }

    const headers = ['ID', 'Name', 'Email', 'Country', 'Role', 'Status'];
    const rows = users.map((user: any) => [
      user.id,
      user.full_name,
      user.email,
      user.country || 'N/A',
      user.roles.map((role: any) => role.name).join(', ') || 'N/A',
      user.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers, ...rows].map((e) => e.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'users.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    toast.error('Failed to export users');
  }
};
