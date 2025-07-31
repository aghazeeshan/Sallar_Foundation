import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateVolunteerPDF = (volunteer) => {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(20);
  doc.setTextColor(1, 110, 92);
  doc.text('Volunteer Application', 20, 20);
  
  // Add personal info
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Personal Information', 20, 40);
  
  doc.setFontSize(12);
  doc.text(`Name: ${volunteer.firstName} ${volunteer.lastName}`, 20, 50);
  doc.text(`Email: ${volunteer.email}`, 20, 60);
  doc.text(`Phone: ${volunteer.phone}`, 20, 70);
  doc.text(`Address: ${volunteer.address}`, 20, 80);
  
  // Add professional details
  doc.setFontSize(16);
  doc.text('Professional Details', 20, 100);
  
  doc.setFontSize(12);
  doc.text(`Occupation: ${volunteer.occupation}`, 20, 110);
  doc.text('Skills:', 20, 120);
  const skills = volunteer.skills.split(',').map(skill => `• ${skill.trim()}`);
  skills.forEach((skill, index) => {
    doc.text(skill, 25, 130 + (index * 7));
  });
  
  // Add availability
  doc.setFontSize(16);
  doc.text('Availability', 20, 160);
  
  doc.setFontSize(12);
  doc.text(`Preferred Time: ${volunteer.availability}`, 20, 170);
  doc.text(`Hours per Week: ${volunteer.hours}`, 20, 180);
  
  // Add experience if available
  if (volunteer.experience) {
    doc.addPage();
    doc.setFontSize(16);
    doc.text('Previous Experience', 20, 20);
    
    doc.setFontSize(12);
    const splitExperience = doc.splitTextToSize(volunteer.experience, 170);
    doc.text(splitExperience, 20, 30);
  }
  
  // Add message if available
  if (volunteer.message) {
    doc.setFontSize(16);
    doc.text('Additional Message', 20, doc.internal.pageSize.height - 60);
    
    doc.setFontSize(12);
    const splitMessage = doc.splitTextToSize(volunteer.message, 170);
    doc.text(splitMessage, 20, doc.internal.pageSize.height - 50);
  }
  
  // Save the PDF
  doc.save(`volunteer-application-${volunteer.firstName}-${volunteer.lastName}.pdf`);
}; 