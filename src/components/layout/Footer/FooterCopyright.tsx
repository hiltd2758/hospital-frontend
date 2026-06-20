const FooterCopyright = () => {
    return (
        <div className="container mx-auto px-4 text-center mt-4 py-[25px] border-t border-[#444444]/10">
            <p className="mb-0">
                © <span>Copyright</span>{' '}
                <strong className="px-1 text-[#555555] font-sans tracking-[1px]">Medicio</strong>{' '}
                <span>All Rights Reserved</span>
            </p>
            <div className="mt-2 text-[13px]">
                Designed by{' '}
                <a
                    href="https://bootstrapmade.com/"
                    className="text-[#3fbbc0] transition-colors duration-300 hover:text-[#3fbbc0]/75"
                >
                    BootstrapMade
                </a>{' '}
                Distributed by{' '}
                <a
                    href="https://themewagon.com"
                    className="text-[#3fbbc0] transition-colors duration-300 hover:text-[#3fbbc0]/75"
                >
                    ThemeWagon
                </a>
            </div>
        </div>
    );
};

export default FooterCopyright;
