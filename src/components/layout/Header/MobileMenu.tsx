import React, { useState, useEffect } from 'react';
import { Patient } from './index'; // <-- Tớ sửa lại import này luôn cho chuẩn nhé
import defaultAvatar from '../../../assets/img/default-avatar.png';

interface MobileMenuProps {
  patient: Patient;
  patientToken: string;
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ patient, patientToken, isOpen, onClose }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const avatarSrc = patient.avatar ? `/img/avatars/${patient.avatar}` : defaultAvatar;

  // Xử lý logic vô hiệu hóa cuộn khi mobile menu mở
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#212529]/80 z-[9999] xl:hidden transition-all duration-300">
      {/* Đổi thẻ <i> thành <button> */}
      <button
        type="button"
        className="absolute top-[15px] right-[15px] bg-transparent border-none p-0 cursor-pointer"
        onClick={onClose}
        aria-label="Close menu"
      >
        <i className="bi bi-x text-white text-[32px]"></i>
      </button>

      <div className="absolute inset-[60px_20px_20px_20px] bg-white rounded-md py-2.5 px-0 overflow-y-auto shadow-[0_0_30px_rgba(0,0,0,0.1)]">
        <ul className="list-none p-0 m-0 flex flex-col">
          <li><a href="/patient/index" className="flex items-center justify-between py-2.5 px-5 text-[#444444] hover:text-[#3fbbc0] text-[17px] font-medium transition-colors" onClick={onClose}>Home</a></li>
          <li><a href="#about" className="flex items-center justify-between py-2.5 px-5 text-[#444444] hover:text-[#3fbbc0] text-[17px] font-medium transition-colors" onClick={onClose}>About</a></li>
          <li><a href="#services" className="flex items-center justify-between py-2.5 px-5 text-[#444444] hover:text-[#3fbbc0] text-[17px] font-medium transition-colors" onClick={onClose}>Services</a></li>
          <li><a href="#doctors" className="flex items-center justify-between py-2.5 px-5 text-[#444444] hover:text-[#3fbbc0] text-[17px] font-medium transition-colors" onClick={onClose}>Doctors</a></li>
          <li><a href="#contact" className="flex items-center justify-between py-2.5 px-5 text-[#444444] hover:text-[#3fbbc0] text-[17px] font-medium transition-colors" onClick={onClose}>Contact</a></li>
          <li><a href="/patient/appointment/book" className="flex items-center justify-between py-2.5 px-5 text-[#3fbbc0] text-[17px] font-medium transition-colors" onClick={onClose}>Make an Appointment</a></li>

          <li className="flex flex-col">
            {/* Đổi thẻ <div> thành <button> */}
            <button
              type="button"
              className="flex items-center justify-between w-full py-2.5 px-5 text-[#444444] text-[17px] font-medium cursor-pointer bg-transparent border-none text-left"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-expanded={isDropdownOpen}
            >
              <div className="flex items-center">
                <img src={avatarSrc} alt="Profile" className="rounded-full mr-2 w-[30px] h-[30px] object-cover" />
                <span>{patient.lastName}</span>
              </div>
              <i className={`bi bi-chevron-down w-[30px] h-[30px] flex items-center justify-center rounded-full transition-all duration-300 text-[12px] ${isDropdownOpen ? 'bg-[#3fbbc0] text-white rotate-180' : 'bg-[#3fbbc0]/10 hover:bg-[#3fbbc0] hover:text-white'}`}></i>
            </button>

            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isDropdownOpen ? 'max-h-96' : 'max-h-0'}`}>
              <ul className="list-none py-2.5 px-0 my-2.5 mx-5 bg-white border border-[#444444]/10">
                <li><a href="/patient/profile" className="block py-2.5 px-5 text-[15px] text-[#444444] hover:text-[#3fbbc0]" onClick={onClose}>Profile</a></li>
                <li><a href={`/patient/clinical-infor/${patient.id}`} className="block py-2.5 px-5 text-[15px] text-[#444444] hover:text-[#3fbbc0]" onClick={onClose}>Medical Records</a></li>
                <li><a href="/patient/appointment/list" className="block py-2.5 px-5 text-[15px] text-[#444444] hover:text-[#3fbbc0]" onClick={onClose}>Appointment List</a></li>
                <li><a href={`http://localhost:3000/?token=${patientToken}`} target="_blank" rel="noreferrer" className="block py-2.5 px-5 text-[15px] text-[#444444] hover:text-[#3fbbc0]" onClick={onClose}>Chat</a></li>
                <li><button className="block w-full text-left py-2.5 px-5 text-[15px] text-[#444444] hover:text-[#3fbbc0] bg-transparent border-none cursor-pointer" onClick={() => { /* thêm logic form.submit() */ onClose(); }}>Logout</button></li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};