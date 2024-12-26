import dashboardIcon from './dashboard.svg';
import manageCattlesIcon from './manageCattles.svg';
import milkProductionsIcon from './milkProductions.svg';
import feedingIcon from './feeding.svg';
import dewormingIcon from './deworming.svg';
import vaccinationIcon from './vaccination.svg';
import treatmentIcon from './treatment.svg';
import fatFresheningIcon from './fatFreshening.svg';
import animalBreedingIcon from './animalBreeding.svg';
import saleIcon from './sale.svg';
import partyIcon from './party.svg';
import supplierIcon from './supplier.svg';
import accountsIcon from './accounts.svg';
import inventoryManagementIcon from './inventoryManagement.svg';
import loneManagementIcon from './loneManagement.svg';
import reportIcon from './report.svg';
import Image from 'next/image';

const icons = {
    dashboard: (
        <Image src={dashboardIcon} alt="Dashboard" width={16} height={16} />
    ),
    manageCattles: (
        <Image
            src={manageCattlesIcon}
            alt="Manage Cattles"
            width={16}
            height={16}
        />
    ),
    milkProductions: (
        <Image
            src={milkProductionsIcon}
            alt="Milk Productions"
            width={16}
            height={16}
        />
    ),
    feeding: <Image src={feedingIcon} alt="Feeding" width={16} height={16} />,
    deworming: (
        <Image src={dewormingIcon} alt="Deworming" width={16} height={16} />
    ),
    vaccination: (
        <Image src={vaccinationIcon} alt="Vaccination" width={16} height={16} />
    ),
    treatment: (
        <Image src={treatmentIcon} alt="Treatment" width={16} height={16} />
    ),
    fatFreshening: (
        <Image
            src={fatFresheningIcon}
            alt="Fat Freshening"
            width={16}
            height={16}
        />
    ),
    animalBreeding: (
        <Image
            src={animalBreedingIcon}
            alt="Animal Breeding"
            width={16}
            height={16}
        />
    ),
    sale: <Image src={saleIcon} alt="Sale" width={16} height={16} />,
    party: <Image src={partyIcon} alt="Party" width={16} height={16} />,
    supplier: (
        <Image src={supplierIcon} alt="Supplier" width={16} height={16} />
    ),
    accounts: (
        <Image src={accountsIcon} alt="Accounts" width={16} height={16} />
    ),
    inventoryManagement: (
        <Image
            src={inventoryManagementIcon}
            alt="Inventory Management"
            width={16}
            height={16}
        />
    ),
    loneManagement: (
        <Image
            src={loneManagementIcon}
            alt="Lone Management"
            width={16}
            height={16}
        />
    ),
    report: <Image src={reportIcon} alt="Report" width={16} height={16} />,
};

export default icons;
