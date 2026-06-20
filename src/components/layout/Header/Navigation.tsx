import React from 'react';
import { ProfileDropdown } from './ProfileDropdown';
import { Patient } from './Header/index';

interface NavigationProps {
  patient: Patient;
  patientToken: string;
}

export const Navigation: React.FC<NavigationProps> = ({ patient, patientToken }) => {
  return (
    <nav className="hidden xl:block p-0">
      <ul className="flex m-0 p-0 list-none items-center">
        <li><a href="/patient/index" className="text-[#444444] hover:text-[#3fbbc0] py-[18px] px-[15px] text-[13px] font-medium uppercase flex items-center justify-between whitespace-nowrap transition-colors duration-300">Home</a></li>
        <li><a href="#about" className="text-[#444444] hover:text-[#3fbbc0] py-[18px] px-[15px] text-[13px] font-medium uppercase flex items-center justify-between whitespace-nowrap transition-colors duration-300">About</a></li>
        <li><a href="#services" className="text-[#444444] hover:text-[#3fbbc0] py-[18px] px-[15px] text-[13px] font-medium uppercase flex items-center justify-between whitespace-nowrap transition-colors duration-300">Services</a></li>
        <li><a href="#doctors" className="text-[#444444] hover:text-[#3fbbc0] py-[18px] px-[15px] text-[13px] font-medium uppercase flex items-center justify-between whitespace-nowrap transition-colors duration-300">Doctors</a></li>
        <li><a href="#contact" className="text-[#444444] hover:text-[#3fbbc0] py-[18px] px-[15px] text-[13px] font-medium uppercase flex items-center justify-between whitespace-nowrap transition-colors duration-300">Contact</a></li>
        <li>
          <a href="/patient/appointment/book" className="bg-[#3fbbc0] hover:bg-[#3fbbc0]/85 text-white text-[14px] py-2 px-5 mx-1.5 ml-[30px] rounded transition-colors duration-300">
            Make an Appointment
          </a>
        </li>
        <ProfileDropdown patient={patient} patientToken={patientToken} />
      </ul>
    </nav>
  );
};
