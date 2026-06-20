import React, { useState } from 'react';
import { Patient } from './index';
import defaultAvatar from '../../../assets/img/default-avatar.png';

interface ProfileDropdownProps {
  patient: Patient;
  patientToken: string;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ patient, patientToken }) => {
  const [isOpen, setIsOpen] = useState(false);

  const avatarSrc = patient.avatar ? `/img/avatars/${patient.avatar}` : defaultAvatar;

  // Sử dụng DOM API để giả lập cơ chế form logout của Thymeleaf bằng React
  const handleLogout = () => {
    const form = document.createElement('form');
    form.method = 'post';
    form.action = '/patient/logout';
    document.body.appendChild(form);
    form.submit();
  };

  return (
    <li className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <a href="#" className="flex items-center text-[#444444] hover:text-[#3fbbc0] py-[18px] pl-[15px] pr-0 text-[13px] font-medium uppercase transition-colors duration-300">
        <img src={avatarSrc} alt="Profile" className="rounded-full mr-2 w-[30px] h-[30px] object-cover" />
        <span>{patient.lastName}</span>
        <i className="bi bi-chevron-down ml-1 text-[12px] leading-none"></i>
      </a>

      <ul className={`absolute left-3.5 top-[130%] bg-white m-0 py-2.5 px-0 rounded shadow-[0_0_30px_rgba(0,0,0,0.1)] z-[99] min-w-[200px] transition-all duration-300 ${isOpen ? 'opacity-100 top-full visible' : 'opacity-0 invisible'}`}>
        <li><a href="/patient/profile" className="block py-2.5 px-5 text-[15px] text-[#444444] hover:text-[#3fbbc0] transition-colors">Profile</a></li>
        <li><a href={`/patient/clinical-infor/${patient.id}`} className="block py-2.5 px-5 text-[15px] text-[#444444] hover:text-[#3fbbc0] transition-colors">Medical Records</a></li>
        <li><a href="/patient/appointment/list" className="block py-2.5 px-5 text-[15px] text-[#444444] hover:text-[#3fbbc0] transition-colors">Appointment List</a></li>
        <li><a href={`http://localhost:3000/?token=${patientToken}`} target="_blank" rel="noreferrer" className="block py-2.5 px-5 text-[15px] text-[#444444] hover:text-[#3fbbc0] transition-colors">Chat</a></li>
        <li>
          <button onClick={handleLogout} className="block w-full text-left py-2.5 px-5 text-[15px] text-[#444444] hover:text-[#3fbbc0] transition-colors cursor-pointer bg-transparent border-none">Logout</button>
        </li>
      </ul>
    </li>
  );
};
