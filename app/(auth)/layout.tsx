import Link from "next/link"
import Image from "next/image"

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="auth-layout">

            <section className="auth-left-section scrollbar-hide-default">
                <Link href="/">
                    <Image src="/assets/icons/logo.svg" alt="Signalist Logo" width={140} height={32} className="h-8 w-auto"></Image>
                </Link>
                <div className="pb-6 lg:pb-8 flex-1">{children}</div>
            </section>

            <section className="auth-right-section">
                <div className="z-10 relative lg:mt-4 lg:mb-16">
                    <blockquote className="auth-blockquote">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto nulla officiis tenetur, eaque impedit iusto dolorem deserunt consequatur reiciendis, culpa beatae eligendi sapiente, cumque pariatur accusamus saepe ipsam illo. Doloribus?
                    </blockquote>

                    <div className="flex items-center justify-between">
                        <div>
                            <cite className="auth-testimonial-author">
                             -Ethan R
                            </cite>
                            <p className="max-md:text-xs text-gray-500">Retail Investor</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-0 5">
                        {[1,2,3,4,5].map((star)=>{
                            return (
                                <Image src="/assets/icons/star.svg" alt="Star Icon" key={star} width={24} height={24} className="h-6 w-6"></Image>
                            )
                        })}
                    </div>
                </div>

                <div className="flex-1 relative">
                    <Image src={"/assets/images/dashboard.png"} width={600} height={600} alt="preview image"></Image>

                    
                </div>

            </section>



        </main>
    )
}

export default Layout
