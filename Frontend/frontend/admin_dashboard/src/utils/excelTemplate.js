// This would be a utility to generate Excel template
// For now, we'll just show instructions in the UI
// In a real implementation, you could use a library like 'xlsx' to generate the file

const generateExcelTemplate = () => {
  // Sample data structure for Excel template
  const templateData = [
    {
      code: 12345,
      password: 12345,
      name: 'أحمد محمد علي',
      specialization: 'CS',
      level: 1,
      semester: 1,
      email: 'ahmed@example.com',
      phone: '0123456789'
    },
    {
      code: 12346,
      password: 12346,
      name: 'فاطمة أحمد حسن',
      specialization: 'Physics',
      level: 2,
      semester: 2,
      email: 'fatima@example.com',
      phone: '0198765432'
    }
  ];

  return templateData;
};

export default generateExcelTemplate;