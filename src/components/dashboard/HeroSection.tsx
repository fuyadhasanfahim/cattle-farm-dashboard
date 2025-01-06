import { DatePicker } from '../shared/DatePicker';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export default async function HeroSection() {
    return (
        <section className="py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Avatar className="size-11">
                        <AvatarImage src="" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="text-[#313131] text-base font-normal font-['Poppins']">
                            Sufia Dairy farm🐄
                        </h3>
                        <p className="text-[#666666] text-xs font-normal font-['Poppins']">
                            Welcome to farming dashboards!
                        </p>
                    </div>
                </div>

                <DatePicker />
            </div>
        </section>
    );
}
