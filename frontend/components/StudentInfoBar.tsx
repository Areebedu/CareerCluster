import React from 'react';
import { User, School, Calendar, GraduationCap, CheckCircle2 } from 'lucide-react';
import { StudentInfo } from '../types';

interface StudentInfoBarProps {
  student: StudentInfo;
  onChange: (field: keyof StudentInfo, value: string) => void;
  totalCircled: number;
}

export const StudentInfoBar: React.FC<StudentInfoBarProps> = ({
  student,
  onChange,
  totalCircled
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 mb-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-orange-600" />
            <span>Student Information</span>
            <span className="font-urdu text-sm font-normal text-slate-500">طالب علم کی معلومات</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Please fill in your details before completing the survey / سروے شروع کرنے سے پہلے اپنی تفصیلات درج کریں
          </p>
        </div>

        <div className="flex items-center gap-3 self-stretch sm:self-auto bg-orange-50 border border-orange-200 px-4 py-2 rounded-xl text-orange-900">
          <CheckCircle2 className="w-5 h-5 text-orange-600 shrink-0" />
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-orange-700">Total Items Circled / کل دائرے</div>
            <div className="text-xl font-extrabold text-orange-950">{totalCircled} <span className="text-xs font-normal text-orange-800">chosen</span></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex justify-between">
            <span>Name</span>
            <span className="font-urdu text-xs text-slate-500">نام</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={student.name}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="e.g. Fatima Ali / فاطمہ علی"
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex justify-between">
            <span>School / College</span>
            <span className="font-urdu text-xs text-slate-500">اسکول / کالج</span>
          </label>
          <div className="relative">
            <School className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={student.school}
              onChange={(e) => onChange('school', e.target.value)}
              placeholder="e.g. Army Public School / بیکن ہاؤس"
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex justify-between">
            <span>Class / Grade</span>
            <span className="font-urdu text-xs text-slate-500">جماعت</span>
          </label>
          <div className="relative">
            <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={student.classGrade}
              onChange={(e) => onChange('classGrade', e.target.value)}
              placeholder="e.g. Grade 10 / Matric / O-Levels"
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex justify-between">
            <span>Date</span>
            <span className="font-urdu text-xs text-slate-500">تاریخ</span>
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="date"
              value={student.date}
              onChange={(e) => onChange('date', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
