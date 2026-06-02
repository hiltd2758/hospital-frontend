import FooterLinks from './FooterLinks';
import FooterCopyright from './FooterCopyright';

const Footer = () => {
    return (
        <footer id="footer" className="bg-[#f7fcfc] text-[#444444] text-[14px] relative">
            <FooterLinks />
            <FooterCopyright />
        </footer>
    );
};

export default Footer;
