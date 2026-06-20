import { Link } from 'react-router-dom';

const FooterLinks = () => {
    return (
        <div className="container mx-auto px-4 pt-[50px]">
            <div className="flex flex-wrap -mx-4 gap-y-6">
                <div className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8">
                    <Link to="/patient/index" className="flex items-center mb-[25px]">
                        <span className="text-[#555555] font-sans text-[26px] font-bold tracking-[1px] leading-none">
                            Medicio
                        </span>
                    </Link>
                    <div className="pt-3">
                        <p className="mb-1 text-[14px] font-sans">A108 Adam Street</p>
                        <p className="mb-1 text-[14px] font-sans">New York, NY 535022</p>
                        <p className="mt-3 mb-1 text-[14px] font-sans">
                            <strong>Phone:</strong> <span>+1 5589 55488 55</span>
                        </p>
                        <p className="mb-1 text-[14px] font-sans">
                            <strong>Email:</strong> <span>info@example.com</span>
                        </p>
                    </div>
                    <div className="flex mt-4">
                        <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full border border-[#444444]/50 text-[16px] text-[#444444]/80 mr-2.5 transition-colors duration-300 hover:text-[#3fbbc0] hover:border-[#3fbbc0]">
                            <i className="bi bi-twitter-x"></i>
                        </a>
                        <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full border border-[#444444]/50 text-[16px] text-[#444444]/80 mr-2.5 transition-colors duration-300 hover:text-[#3fbbc0] hover:border-[#3fbbc0]">
                            <i className="bi bi-facebook"></i>
                        </a>
                        <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full border border-[#444444]/50 text-[16px] text-[#444444]/80 mr-2.5 transition-colors duration-300 hover:text-[#3fbbc0] hover:border-[#3fbbc0]">
                            <i className="bi bi-instagram"></i>
                        </a>
                        <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full border border-[#444444]/50 text-[16px] text-[#444444]/80 mr-2.5 transition-colors duration-300 hover:text-[#3fbbc0] hover:border-[#3fbbc0]">
                            <i className="bi bi-linkedin"></i>
                        </a>
                    </div>
                </div>

                <div className="w-full md:w-1/4 lg:w-1/6 px-4 mb-[30px]">
                    <h4 className="text-[16px] font-bold relative pb-3 text-[#555555]">Useful Links</h4>
                    <ul className="list-none p-0 m-0">
                        <li className="py-2.5 flex items-center pt-0"><a href="#" className="text-[#444444]/70 inline-block leading-none transition-colors duration-300 hover:text-[#3fbbc0]">Home</a></li>
                        <li className="py-2.5 flex items-center"><a href="#" className="text-[#444444]/70 inline-block leading-none transition-colors duration-300 hover:text-[#3fbbc0]">About us</a></li>
                        <li className="py-2.5 flex items-center"><a href="#" className="text-[#444444]/70 inline-block leading-none transition-colors duration-300 hover:text-[#3fbbc0]">Services</a></li>
                        <li className="py-2.5 flex items-center"><a href="#" className="text-[#444444]/70 inline-block leading-none transition-colors duration-300 hover:text-[#3fbbc0]">Terms of service</a></li>
                        <li className="py-2.5 flex items-center"><a href="#" className="text-[#444444]/70 inline-block leading-none transition-colors duration-300 hover:text-[#3fbbc0]">Privacy policy</a></li>
                    </ul>
                </div>

                <div className="w-full md:w-1/4 lg:w-1/6 px-4 mb-[30px]">
                    <h4 className="text-[16px] font-bold relative pb-3 text-[#555555]">Our Services</h4>
                    <ul className="list-none p-0 m-0">
                        <li className="py-2.5 flex items-center pt-0"><a href="#" className="text-[#444444]/70 inline-block leading-none transition-colors duration-300 hover:text-[#3fbbc0]">Web Design</a></li>
                        <li className="py-2.5 flex items-center"><a href="#" className="text-[#444444]/70 inline-block leading-none transition-colors duration-300 hover:text-[#3fbbc0]">Web Development</a></li>
                        <li className="py-2.5 flex items-center"><a href="#" className="text-[#444444]/70 inline-block leading-none transition-colors duration-300 hover:text-[#3fbbc0]">Product Management</a></li>
                        <li className="py-2.5 flex items-center"><a href="#" className="text-[#444444]/70 inline-block leading-none transition-colors duration-300 hover:text-[#3fbbc0]">Marketing</a></li>
                        <li className="py-2.5 flex items-center"><a href="#" className="text-[#444444]/70 inline-block leading-none transition-colors duration-300 hover:text-[#3fbbc0]">Graphic Design</a></li>
                    </ul>
                </div>

                <div className="w-full md:w-1/4 lg:w-1/6 px-4 mb-[30px]">
                    <h4 className="text-[16px] font-bold relative pb-3 text-[#555555]">Hic solutasetp</h4>
                    <ul className="list-none p-0 m-0">
                        <li className="py-2.5 flex items-center pt-0"><a href="#" className="text-[#444444]/70 inline-block leading-none transition-colors duration-300 hover:text-[#3fbbc0]">Molestiae accusamus iure</a></li>
                        <li className="py-2.5 flex items-center"><a href="#" className="text-[#444444]/70 inline-block leading-none transition-colors duration-300 hover:text-[#3fbbc0]">Excepturi dignissimos</a></li>
                        <li className="py-2.5 flex items-center"><a href="#" className="text-[#444444]/70 inline-block leading-none transition-colors duration-300 hover:text-[#3fbbc0]">Suscipit distinctio</a></li>
                        <li className="py-2.5 flex items-center"><a href="#" className="text-[#444444]/70 inline-block leading-none transition-colors duration-300 hover:text-[#3fbbc0]">Dilecta</a></li>
                        <li className="py-2.5 flex items-center"><a href="#" className="text-[#444444]/70 inline-block leading-none transition-colors duration-300 hover:text-[#3fbbc0]">Sit quas consectetur</a></li>
                    </ul>
                </div>

                <div className="w-full md:w-1/4 lg:w-1/6 px-4 mb-[30px]">
                    <h4 className="text-[16px] font-bold relative pb-3 text-[#555555]">Nobis illum</h4>
                    <ul className="list-none p-0 m-0">
                        <li className="py-2.5 flex items-center pt-0"><a href="#" className="text-[#444444]/70 inline-block leading-none transition-colors duration-300 hover:text-[#3fbbc0]">Ipsam</a></li>
                        <li className="py-2.5 flex items-center"><a href="#" className="text-[#444444]/70 inline-block leading-none transition-colors duration-300 hover:text-[#3fbbc0]">Laudantium dolorum</a></li>
                        <li className="py-2.5 flex items-center"><a href="#" className="text-[#444444]/70 inline-block leading-none transition-colors duration-300 hover:text-[#3fbbc0]">Dinera</a></li>
                        <li className="py-2.5 flex items-center"><a href="#" className="text-[#444444]/70 inline-block leading-none transition-colors duration-300 hover:text-[#3fbbc0]">Trodelas</a></li>
                        <li className="py-2.5 flex items-center"><a href="#" className="text-[#444444]/70 inline-block leading-none transition-colors duration-300 hover:text-[#3fbbc0]">Flexo</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default FooterLinks;
