import Image from 'next/image';

export default async function BottomPieChart() {
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div className="p-4 w-72 h-[180px] bg-white rounded-2xl shadow-[4px_3px_15px_0px_rgba(82,170,70,0.10)] border flex flex-col items-center justify-center">
                <div className="flex justify-center items-center gap-2">
                    <div className="space-y-4">
                        <h3 className="text-[#52aa46] text-base font-bold font-['FN Mahfuj Rumaysa']">
                            ফিডিং
                        </h3>
                        <p className="text-[#313131] text-base font-bold font-['FN Mahfuj Rumaysa']">
                            মোট: ১২ টাইম
                        </p>
                        <div className="text-[#666666] text-xs font-normal font-['FN Shorif Borsha Bijoy52'] flex items-center gap-2 justify-between">
                            <span>এই বছর:</span>
                            <span>১২</span>
                        </div>
                    </div>

                    <div className="flex items-end justify-end">
                        <Image
                            src={'https://iili.io/2UXR5ej.png'}
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
                        <h3 className="text-[#52aa46] text-base font-bold font-['FN Mahfuj Rumaysa']">
                            কৃমিনাশক
                        </h3>
                        <p className="text-[#313131] text-base font-bold font-['FN Mahfuj Rumaysa']">
                            মোট: ১৫
                        </p>
                        <div className="text-[#666666] text-xs font-normal font-['FN Shorif Borsha Bijoy52'] flex items-center gap-2 justify-between">
                            <span>এই বছর:</span>
                            <span>১৫</span>
                        </div>
                    </div>

                    <div className="flex items-end justify-end">
                        <Image
                            src={'https://iili.io/2UXRGrF.png'}
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
                        <h3 className="text-[#52aa46] text-base font-bold font-['FN Mahfuj Rumaysa']">
                            টিকাদান
                        </h3>
                        <p className="text-[#313131] text-base font-bold font-['FN Mahfuj Rumaysa']">
                            মোট: ৩২ টাইম
                        </p>
                        <div className="text-[#666666] text-xs font-normal font-['FN Shorif Borsha Bijoy52'] flex items-center gap-2 justify-between">
                            <span>এই বছর:</span>
                            <span>৩২</span>
                        </div>
                    </div>

                    <div className="flex items-end justify-end">
                        <Image
                            src={'https://iili.io/2UXRW7a.png'}
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
                        <h3 className="text-[#52aa46] text-base font-bold font-['FN Mahfuj Rumaysa']">
                            চিকিৎসা
                        </h3>
                        <p className="text-[#313131] text-base font-bold font-['FN Mahfuj Rumaysa']">
                            মোট: ১২ টাইম
                        </p>
                        <div className="text-[#666666] text-xs font-normal font-['FN Shorif Borsha Bijoy52'] flex items-center gap-2 justify-between">
                            <span>এই বছর:</span>
                            <span>০৫</span>
                        </div>
                    </div>

                    <div className="flex items-end justify-end">
                        <Image
                            src={'https://iili.io/2UXRVdg.png'}
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
