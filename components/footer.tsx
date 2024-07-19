import Link from "next/link";


const Footer = () => {
    return (
        <footer className="flex flex-col relative items-center justify-center border-t border-white/50  pt-16 pb-8 px-6 lg:px-8 w-full max-w-6xl mx-auto lg:pt-20 ">
            <div className="grid gap-8 xl:grid-cols-3 xl:gap-8 w-full">
              
                    <div className="flex flex-col items-start justify-start md:max-w-[200px]">
                        <div className="flex items-center gap-2">
                            <span className="text-base md:text-lg font-medium text-foreground">
                                KashFlow
                            </span>
                        </div>
                        <p className="text-muted-foreground   mt-4 text-sm text-start">
                        KashFlow is a simple and intuitive web app that helps you stay on top of your finances
                        </p>
                    </div>
              

                <div className="grid-cols-2 gap-8 grid mt-16 xl:col-span-2 xl:mt-0">
                    <div className="md:grid md:grid-cols-2 md:gap-8">
                    <div>
                            <h3 className="text-base font-medium text-foreground">
                                Product
                            </h3>
                            <ul className="mt-4 text-sm text-muted-foreground space-y-4">
                                <li className="mt-2">
                                    <Link href="#" className="link hover:text-foreground transition-all duration-300">
                                        Features
                                    </Link>
                                </li>
                                <li className="mt-2">
                                    <Link href="#" className="link hover:text-foreground transition-all duration-300">
                                        Pricing
                                    </Link>
                                </li>
                                <li className="mt-2">
                                    <Link href="#" className="link hover:text-foreground transition-all duration-300">
                                        Testimonials
                                    </Link>
                                </li>
                                <li className="mt-2">
                                    <Link href="#" className="link hover:text-foreground transition-all duration-300">
                                        Supported Languages
                                    </Link>
                                </li>
                            </ul>
                            </div>
                       
                            <div className="mt-10 md:mt-0 flex flex-col">
                                <h3 className="text-base font-medium text-foreground">
                                    Solutions
                                </h3>
                                <ul className="mt-4 text-sm text-muted-foreground space-y-4">
                                    <li>
                                        <Link href="#" className="link hover:text-foreground transition-all duration-300">
                                            Content Creators
                                        </Link>
                                    </li>
                                    <li className="mt-2">
                                        <Link href="#" className="link hover:text-foreground transition-all duration-300">
                                            Businesses
                                        </Link>
                                    </li>
                                    <li className="mt-2">
                                        <Link href="#" className="link hover:text-foreground transition-all duration-300">
                                            Education
                                        </Link>
                                    </li>
                                    <li className="mt-2">
                                        <Link href="#" className="link hover:text-foreground transition-all duration-300">
                                            Enterprise
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                    
                    </div>
                    <div className="md:grid md:grid-cols-2 md:gap-8">
                       <div>
                            <h3 className="text-base font-medium text-foreground">
                                Resources
                            </h3>
                            <ul className="mt-4 text-sm text-muted-foreground space-y-4">
                                <li className="mt-2">
                                    <Link href="#" className="link hover:text-foreground transition-all duration-300">
                                        Blog
                                    </Link>
                                </li>
                                <li className="mt-2">
                                    <Link href="#" className="link hover:text-foreground transition-all duration-300">
                                        Translation Guides
                                    </Link>
                                </li>
                                <li className="mt-2">
                                    <Link href="#" className="link hover:text-foreground transition-all duration-300">
                                        Support
                                    </Link>
                                </li>
                            </ul>
                            </div>
                     
                            <div className="mt-10 md:mt-0 flex flex-col">
                                <h3 className="text-base font-medium text-foreground">
                                    Company
                                </h3>
                                <ul className="mt-4 text-sm text-muted-foreground space-y-4">
                                    <li>
                                        <Link href="#" className="link hover:text-foreground transition-all duration-300">
                                            About Us
                                        </Link>
                                    </li>
                                    <li className="mt-2">
                                        <Link href="#" className="link hover:text-foreground transition-all duration-300">
                                            Privacy Policy
                                        </Link>
                                    </li>
                                    <li className="mt-2">
                                        <Link href="#" className="link hover:text-foreground transition-all duration-300">
                                            Terms & Conditions
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                    
                    </div>
                </div>
            </div>

            <div  className="w-full relative mt-12 lg:mt-20 border-t">
                <div className="mt-8 md:flex md:items-center justify-center  w-full">
                    <p className="text-sm text-muted-foreground mt-8 md:mt-0">
                        &copy; {new Date().getFullYear()} KashFlow. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
};

export default Footer
