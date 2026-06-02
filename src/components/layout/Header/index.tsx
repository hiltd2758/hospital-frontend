import React, { useState } from 'react';
import { Topbar } from './Topbar';
import { Navigation } from './Navigation';
import { MobileMenu } from './MobileMenu';
import logoImg from '../../../assets/img/logo.png';

export interface Patient {
  id: string | number;
  lastName: string;
  avatar?: string | null;
}

interface HeaderProps {
  patient: Patient;
  patientToken: string;
}

export const Header: React.FC<HeaderProps> = ({ patient, patientToken }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white text-[#444444] sticky top-0 transition-all duration-500 z-[997] shadow-[0_0_18px_rgba(0,0,0,0.1)]">
      <Topbar />

      <div className="min-h-[60px] py-2.5">
        <div className="container mx-auto px-4 relative flex items-center justify-end">

          <a href="/patient/index" className="flex items-center mr-auto leading-none">
            <img src={logoImg} alt="Logo" className="max-h-[36px] mr-2" />
          </a>

          <Navigation patient={patient} patientToken={patientToken} />

          <i
            className="bi bi-list text-[#444444] text-[28px] leading-none mr-2.5 cursor-pointer transition-colors duration-300 xl:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsMobileMenuOpen(true);
              }
            }}
          ></i>
        </div>
      </div>

      <MobileMenu
        patient={patient}
        patientToken={patientToken}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
};

export default Header;
