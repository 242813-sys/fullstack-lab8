export enum Department {
  COMPUTER_SCIENCE = 'Computer Science',
  DATA_SCIENCE = 'Data Science',
  SOFTWARE_ENGINEERING = 'Software Engineering',
  ELECTRICAL_ENGINEERING = 'Electrical Engineering',
  ARTIFICIAL_INTELLIGENCE = 'Artificial Intelligence',
}

export interface Student {
  rollNumber: string;
  name: string;
  cgpa: number;
  department: Department;
}
