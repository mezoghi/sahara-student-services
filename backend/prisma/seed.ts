import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@saharastudentservices.com' },
    update: {},
    create: {
      email: 'admin@saharastudentservices.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      phone: '+1234567890',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create counsellor user
  const counsellor = await prisma.user.upsert({
    where: { email: 'counsellor@saharastudentservices.com' },
    update: {},
    create: {
      email: 'counsellor@saharastudentservices.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Counsellor',
      role: UserRole.COUNSELLOR,
      phone: '+1234567891',
    },
  });
  console.log('✅ Counsellor user created:', counsellor.email);

  // Create sample student
  const student = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      email: 'student@example.com',
      password: hashedPassword,
      firstName: 'Jane',
      lastName: 'Student',
      role: UserRole.STUDENT,
      phone: '+1234567892',
    },
  });
  console.log('✅ Sample student created:', student.email);

  // Create 10 schools
  const schools = [
    {
      name: 'University of Oxford',
      description: 'The University of Oxford is a collegiate research university in Oxford, England. There is evidence of teaching as early as 1096, making it the oldest university in the English-speaking world.',
      website: 'https://www.ox.ac.uk',
      isActive: true,
    },
    {
      name: 'University of Cambridge',
      description: 'The University of Cambridge is a collegiate research university in Cambridge, United Kingdom. Founded in 1209, it is the second-oldest university in the English-speaking world.',
      website: 'https://www.cam.ac.uk',
      isActive: true,
    },
    {
      name: 'Imperial College London',
      description: 'Imperial College London is a public research university in London. Imperial grew out of Prince Albert\'s vision of an area for culture, including the Royal Albert Hall, Imperial Institute, numerous museums, and the Royal Colleges.',
      website: 'https://www.imperial.ac.uk',
      isActive: true,
    },
    {
      name: 'London School of Economics',
      description: 'The London School of Economics and Political Science is a public research university located in London, England, and a member institution of the federal University of London.',
      website: 'https://www.lse.ac.uk',
      isActive: true,
    },
    {
      name: 'University College London',
      description: 'University College London is a public research university in London, United Kingdom. It is a member institution of the federal University of London, and is the second-largest university in the UK by total enrolment.',
      website: 'https://www.ucl.ac.uk',
      isActive: true,
    },
    {
      name: 'University of Edinburgh',
      description: 'The University of Edinburgh is a public research university in Edinburgh, Scotland. Founded in 1582, it is the sixth-oldest university in the English-speaking world.',
      website: 'https://www.ed.ac.uk',
      isActive: true,
    },
    {
      name: 'University of Manchester',
      description: 'The University of Manchester is a public research university in Manchester, England, formed in 2004 by the merger of the University of Manchester Institute of Science and Technology and the Victoria University of Manchester.',
      website: 'https://www.manchester.ac.uk',
      isActive: true,
    },
    {
      name: 'King\'s College London',
      description: 'King\'s College London is a public research university located in London, United Kingdom, and a member institution of the federal University of London.',
      website: 'https://www.kcl.ac.uk',
      isActive: true,
    },
    {
      name: 'University of Warwick',
      description: 'The University of Warwick is a public research university on the outskirts of Coventry between the West Midlands and Warwickshire, England.',
      website: 'https://warwick.ac.uk',
      isActive: true,
    },
    {
      name: 'University of Bristol',
      description: 'The University of Bristol is a red brick Russell Group research university in Bristol, England. It received its royal charter in 1909.',
      website: 'https://www.bristol.ac.uk',
      isActive: true,
    },
  ];

  const createdSchools = [];
  for (const school of schools) {
    const created = await prisma.school.create({ data: school });
    createdSchools.push(created);
    console.log(`✅ School created: ${created.name}`);
  }

  // Create 20 courses (2 per school)
  const courseLevels = ['Undergraduate', 'Postgraduate'];
  const courseTypes = [
    { name: 'Computer Science', requirements: 'A-levels: AAA including Mathematics. IELTS: 7.0 overall' },
    { name: 'Business Administration', requirements: 'A-levels: AAB. IELTS: 6.5 overall' },
    { name: 'Engineering', requirements: 'A-levels: A*AA including Mathematics and Physics. IELTS: 6.5 overall' },
    { name: 'Medicine', requirements: 'A-levels: A*AA including Chemistry and Biology. IELTS: 7.5 overall' },
    { name: 'Law', requirements: 'A-levels: AAA. IELTS: 7.0 overall' },
    { name: 'Economics', requirements: 'A-levels: A*AA including Mathematics. IELTS: 7.0 overall' },
    { name: 'Psychology', requirements: 'A-levels: AAB. IELTS: 6.5 overall' },
    { name: 'International Relations', requirements: 'A-levels: AAB. IELTS: 7.0 overall' },
    { name: 'Architecture', requirements: 'A-levels: AAA. Portfolio required. IELTS: 6.5 overall' },
    { name: 'Data Science', requirements: 'A-levels: AAA including Mathematics. IELTS: 6.5 overall' },
  ];

  let courseIndex = 0;
  for (const school of createdSchools) {
    for (let i = 0; i < 2; i++) {
      const courseType = courseTypes[courseIndex % courseTypes.length];
      const level = courseLevels[i];
      const isUndergrad = level === 'Undergraduate';

      const course = await prisma.course.create({
        data: {
          schoolId: school.id,
          name: `${level} ${courseType.name}`,
          level,
          duration: isUndergrad ? '3 years' : '1 year',
          tuitionFee: isUndergrad ? 25000 : 30000,
          currency: 'GBP',
          description: `This ${level.toLowerCase()} program in ${courseType.name} at ${school.name} provides comprehensive education and practical experience in the field. Students will gain deep knowledge and skills necessary for successful careers.`,
          requirements: courseType.requirements,
          startDate: 'September 2024',
        },
      });
      console.log(`✅ Course created: ${course.name} at ${school.name}`);
      courseIndex++;
    }
  }

  // Create form fields
  const formFields = [
    { label: 'First Name', fieldType: 'text', placeholder: 'Enter your first name', required: true, order: 1 },
    { label: 'Last Name', fieldType: 'text', placeholder: 'Enter your last name', required: true, order: 2 },
    { label: 'Email', fieldType: 'email', placeholder: 'your.email@example.com', required: true, order: 3 },
    { label: 'Phone Number', fieldType: 'tel', placeholder: '+1234567890', required: true, order: 4 },
    { label: 'Date of Birth', fieldType: 'date', placeholder: '', required: true, order: 5 },
    { label: 'Nationality', fieldType: 'text', placeholder: 'Your nationality', required: true, order: 6 },
    { label: 'Passport Number', fieldType: 'text', placeholder: 'Passport number', required: false, order: 7 },
    { label: 'Address', fieldType: 'textarea', placeholder: 'Full address', required: true, order: 8 },
    { label: 'Previous Education', fieldType: 'textarea', placeholder: 'Describe your educational background', required: true, order: 9 },
    { label: 'English Proficiency', fieldType: 'select', placeholder: '', required: true, order: 10, options: JSON.stringify(['IELTS', 'TOEFL', 'Cambridge', 'Native Speaker']) },
    { label: 'Personal Statement', fieldType: 'textarea', placeholder: 'Why do you want to study this course?', required: true, order: 11 },
    { label: 'Academic Transcript', fieldType: 'file', placeholder: '', required: true, order: 12 },
    { label: 'Passport Copy', fieldType: 'file', placeholder: '', required: true, order: 13 },
  ];

  for (const field of formFields) {
    await prisma.formField.create({ data: field });
  }
  console.log('✅ Form fields created');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
