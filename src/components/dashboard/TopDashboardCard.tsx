import Image from 'next/image';

export default async function TopDashboardCard() {
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div className="p-4 w-72 h-[180px] bg-white rounded-2xl shadow-[4px_3px_15px_0px_rgba(82,170,70,0.10)] border flex flex-col items-center justify-center">
                <div className="flex justify-center items-center gap-2">
                    <div className="space-y-4">
                        <h3 className="text-green-500 text-base font-bold ">
                            নিবন্ধিত গবাদি পশু
                        </h3>
                        <p className="text-[#313131] text-base font-bold ">
                            মোট: ১২
                        </p>
                        <div className="text-[#666666] text-xs font-normal  flex items-center gap-2 justify-between">
                            <span>এই বছর:</span>
                            <span>১২</span>
                        </div>
                    </div>

                    <div className="flex items-end justify-end">
                        <Image
                            src={'https://iili.io/2UXRcXV.png'}
                            alt="card image"
                            width={123}
                            height={86}
                        />
                    </div>
                </div>
            </div>

            <div className="p-4 w-72 h-[180px] bg-white rounded-2xl shadow-[4px_3px_15px_0px_rgba(82,170,70,0.10)] border flex flex-col items-center justify-center">
                <div className="flex justify-center items-center gap-2">
                    <div className="space-y-4">
                        <h3 className="text-green-500 text-base font-bold ">
                            গবাদি পশুর মোট মূল্য
                        </h3>
                        <p className="text-[#313131] text-base font-bold ">
                            মোট: ৫৫৫০০০০ টাকা
                        </p>
                        <div className="text-[#666666] text-xs font-normal  flex items-center gap-2 justify-between">
                            <span>মোট গবাদি পশু:</span>
                            <span>৪০</span>
                        </div>
                    </div>

                    <div className="flex items-end justify-end">
                        <Image
                            src={'https://iili.io/2UXRazQ.png'}
                            alt="card image"
                            width={123}
                            height={86}
                        />
                    </div>
                </div>
            </div>

            <div className="p-4 w-72 h-[180px] bg-white rounded-2xl shadow-[4px_3px_15px_0px_rgba(82,170,70,0.10)] border flex flex-col items-center justify-center">
                <div className="flex justify-center items-center gap-2">
                    <div className="space-y-4">
                        <h3 className="text-green-500 text-base font-bold ">
                            বিক্রিত গবাদি পশুর মোট মূল্য
                        </h3>
                        <p className="text-[#313131] text-base font-bold ">
                            মোট: ২৫,৫০,০০০ টাকা
                        </p>
                        <div className="text-[#666666] text-xs font-normal  flex items-center gap-2 justify-between">
                            <span>বিক্রিত গবাদি পশু:</span>
                            <span>০৬</span>
                        </div>
                    </div>

                    <div className="flex items-end justify-end">
                        <Image
                            src={'https://iili.io/2UXRE11.png'}
                            alt="card image"
                            width={123}
                            height={86}
                        />
                    </div>
                </div>
            </div>

            <div className="p-4 w-72 h-[180px] bg-white rounded-2xl shadow-[4px_3px_15px_0px_rgba(82,170,70,0.10)] border flex flex-col items-center justify-center">
                <div className="flex justify-center items-center gap-2">
                    <div className="space-y-4">
                        <h3 className="text-green-500 text-base font-bold ">
                            দুধ উৎপাদন
                        </h3>
                        <p className="text-[#313131] text-base font-bold ">
                            মোট: ২৫০ লিটার
                        </p>
                        <div className="text-[#666666] text-xs font-normal  flex items-center gap-2 justify-between">
                            <span>এই বছর:</span>
                            <span>২৫০</span>
                        </div>
                    </div>

                    <div className="flex items-end justify-end">
                        <Image
                            src={'https://iili.io/2UXR7mx.png'}
                            alt="card image"
                            width={123}
                            height={86}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
