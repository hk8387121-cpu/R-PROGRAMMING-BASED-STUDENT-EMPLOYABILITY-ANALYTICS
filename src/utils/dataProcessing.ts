import { StudentRecord } from '../types/student';

export function matchColumn(columns: string[], possibleNames: string[]): string | undefined {
  const lowerCols = columns.map(c => c.toLowerCase().trim().replace(/[^a-z0-9]/g, ''));
  for (const name of possibleNames) {
    const cleanName = name.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
    const idx = lowerCols.indexOf(cleanName);
    if (idx !== -1) return columns[idx];
    
    // Fuzzy match
    const fuzzyIdx = lowerCols.findIndex(c => c.includes(cleanName) || cleanName.includes(c));
    if (fuzzyIdx !== -1) return columns[fuzzyIdx];
  }
  return undefined;
}

export const columnMappings = {
  studentId: ['studentid', 'id', 'rollno', 'student_id', 'roll'],
  placementStatus: ['placementstatus', 'placed', 'placement_status', 'status'],
  cgpa: ['cgpa', 'cgp', 'degreecgpa'],
  technicalSkill: ['technicalskill', 'technicalskillscore', 'technical_skill_score', 'techskill'],
  softSkill: ['softskill', 'softskillscore', 'soft_skill_score', 'softskill'],
  salary: ['salary', 'salarypackage', 'salarypackagelpa', 'salary_package_lpa', 'lpa'],
  internships: ['internship', 'internshipcount', 'internship_count', 'internships'],
  attendance: ['attendance', 'attendancepercentage', 'attendance_percentage'],
  backlogs: ['backlog', 'backlogs', 'historyofbacklogs'],
  ssc: ['ssc', 'sscpercentage', 'ssc_percentage', '10th'],
  hsc: ['hsc', 'hscpercentage', 'hsc_percentage', '12th'],
  degree: ['degree', 'degreepercentage', 'degree_percentage', 'ug'],
  liveProjects: ['liveprojects', 'live_projects', 'projects'],
  workExperience: ['workexperience', 'work_experience_months', 'experience'],
  certifications: ['certifications', 'certification'],
  entranceExam: ['entranceexam', 'entranceexamscore', 'entrance_exam_score']
};

export function getMappedColumns(columns: string[]) {
  return {
    studentId: matchColumn(columns, columnMappings.studentId),
    placementStatus: matchColumn(columns, columnMappings.placementStatus),
    cgpa: matchColumn(columns, columnMappings.cgpa),
    technicalSkill: matchColumn(columns, columnMappings.technicalSkill),
    softSkill: matchColumn(columns, columnMappings.softSkill),
    salary: matchColumn(columns, columnMappings.salary),
    internships: matchColumn(columns, columnMappings.internships),
    attendance: matchColumn(columns, columnMappings.attendance),
    backlogs: matchColumn(columns, columnMappings.backlogs),
    ssc: matchColumn(columns, columnMappings.ssc),
    hsc: matchColumn(columns, columnMappings.hsc),
    degree: matchColumn(columns, columnMappings.degree),
    liveProjects: matchColumn(columns, columnMappings.liveProjects),
    workExperience: matchColumn(columns, columnMappings.workExperience),
    certifications: matchColumn(columns, columnMappings.certifications),
    entranceExam: matchColumn(columns, columnMappings.entranceExam),
  };
}

export function parseNumber(val: any): number {
  if (val === undefined || val === null || val === '') return NaN;
  const num = Number(val);
  return isNaN(num) ? NaN : num;
}

export function isPlaced(val: any): boolean {
  if (val === undefined || val === null) return false;
  const s = String(val).toLowerCase().trim();
  return s === 'placed' || s === 'yes' || s === '1' || s === 'true';
}
