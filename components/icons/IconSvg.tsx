import { memo } from 'react';
import Icon from '@ant-design/icons';

import phoneSvg from '../../resources/images/icons/phone.svg';
import companySvg from '../../resources/images/icons/company.svg';
import keySvg from '../../resources/images/icons/key.svg';
import metamaskSvg from '../../resources/images/icons/metamask.svg';
import agencySvg from '../../resources/images/icons/agency.svg';
import mapPointSvg from '../../resources/images/icons/mapPoint.svg';
import statusSvg from '../../resources/images/icons/status.svg';
import filterSvg from '../../resources/images/icons/filter.svg';
import starSvg from '../../resources/images/icons/star.svg';
import starFilledSvg from 'resources/images/icons/star-filled.svg';
import energySvg from '../../resources/images/icons/project-types/energy.svg';
import forestrySvg from '../../resources/images/icons/project-types/forestry.svg';
import searchSvg from '../../resources/images/icons/search.svg';
import projectSvg from '../../resources/images/icons/nav-menu/project.svg';
import dashboardSvg from '../../resources/images/icons/dashboard.svg';
import requestsSvg from '../../resources/images/icons/nav-menu/requests.svg';
import approvedSvg from '../../resources/images/icons/project-status/approved.svg';
import rejectedSvg from '../../resources/images/icons/project-status/rejected.svg';
import createdSvg from '../../resources/images/icons/project-status/created.svg';
import pendingSvg from '../../resources/images/icons/project-status/pending.svg';
import auditWaitingSvg from '../../resources/images/icons/project-status/auditWaiting.svg';
import greenPendingSvg from '../../resources/images/icons/project-status/greenPending.svg';
import documentSvg from '../../resources/images/icons/document.svg';
import downloadSvg from '../../resources/images/icons/download.svg';
import addressSvg from '../../resources/images/icons/address.svg';
import websiteSvg from '../../resources/images/icons/website.svg';
import arrowRightSvg from '../../resources/images/icons/arrowRight.svg';
import eventSvg from '../../resources/images/icons/event.svg';
import factorySvg from '../../resources/images/icons/factory.svg';
import planetSvg from '../../resources/images/icons/planet.svg';
import mailSvg from '../../resources/images/icons/mail.svg';
import arrowLeftSvg from '../../resources/images/icons/arrowLeft.svg';
import projectsSvg from '../../resources/images/icons/nav-menu/projects.svg';
import walletSvg from '../../resources/images/icons/nav-menu/wallet.svg';
import portfolioSvg from '../../resources/images/icons/nav-menu/portfolio.svg';
import avatarSvg from '../../resources/images/icons/avatar.svg';
import profileSvg from '../../resources/images/icons/profile.svg';
import copySvg from '../../resources/images/icons/copy.svg';
import favouritesSvg from '../../resources/images/icons/favourites.svg';
import linkSvg from '../../resources/images/icons/link.svg';
import editSvg from '../../resources/images/icons/edit.svg';
import burnedSvg from '../../resources/images/icons/burned.svg';
import maskSvg from '../../resources/images/icons/mask.svg';
import timeSvg from '../../resources/images/icons/time.svg';
import auctionSvg from '../../resources/images/icons/nav-menu/auction.svg';
import energyDistributionSvg from '../../resources/images/icons/project-types/EnergyDistribution_icon.svg';
import energyIndustriesSvg from '../../resources/images/icons/project-types/EnergyIndustries_icon.svg';
import chemicalSvg from '../../resources/images/icons/project-types/ChemicalIndustry_icon.svg';
import fugitiveEmissionsSvg from '../../resources/images/icons/project-types/FugitiveEmissions_icon.svg';
import livestockSvg from '../../resources/images/icons/project-types/Livestock_icon.svg';
import manufacturingSvg from '../../resources/images/icons/project-types/ManufacturingIndustries_icon.svg';
import metalProductionSvg from '../../resources/images/icons/project-types/MetalProduction_icon.svg';
import miningSvg from '../../resources/images/icons/project-types/Mining_icon.svg';
import transportSvg from '../../resources/images/icons/project-types/Transport_icon.svg';
import wasteHandlingAndDisposalSvg from '../../resources/images/icons/project-types/WasteHandlingAndDisposal_icon.svg';
import bridgeSvg from '../../resources/images/icons/bridge.svg';
import explorerSvg from '../../resources/images/icons/explorer.svg';
import dexSvg from '../../resources/images/icons/dex.svg';

import { Icons, IconType } from 'types';

const icons: Record<Icons, { src: string; type: IconType }> = {
  phone: { src: phoneSvg, type: IconType.icon },
  key: { src: keySvg, type: IconType.icon },
  company: { src: companySvg, type: IconType.icon },
  metamask: { src: metamaskSvg, type: IconType.img },
  agency: { src: agencySvg, type: IconType.icon },
  mapPoint: { src: mapPointSvg, type: IconType.icon },
  status: { src: statusSvg, type: IconType.icon },
  search: { src: searchSvg, type: IconType.icon },
  filter: { src: filterSvg, type: IconType.icon },
  star: { src: starSvg, type: IconType.icon },
  starFilled: { src: starFilledSvg, type: IconType.icon },
  energy: { src: energySvg, type: IconType.icon },
  forestry: { src: forestrySvg, type: IconType.icon },
  portfolio: { src: portfolioSvg, type: IconType.icon },
  wallet: { src: walletSvg, type: IconType.icon },
  project: { src: projectSvg, type: IconType.icon },
  dashboard: { src: dashboardSvg, type: IconType.icon },
  requests: { src: requestsSvg, type: IconType.icon },
  avatar: { src: avatarSvg, type: IconType.icon },
  profile: { src: profileSvg, type: IconType.icon },
  copy: { src: copySvg, type: IconType.icon },
  approved: { src: approvedSvg, type: IconType.icon },
  created: { src: createdSvg, type: IconType.icon },
  rejected: { src: rejectedSvg, type: IconType.icon },
  auditWaiting: { src: auditWaitingSvg, type: IconType.icon },
  pending: { src: pendingSvg, type: IconType.icon },
  document: { src: documentSvg, type: IconType.icon },
  download: { src: downloadSvg, type: IconType.icon },
  address: { src: addressSvg, type: IconType.icon },
  website: { src: websiteSvg, type: IconType.icon },
  arrowRight: { src: arrowRightSvg, type: IconType.icon },
  event: { src: eventSvg, type: IconType.icon },
  factory: { src: factorySvg, type: IconType.icon },
  planet: { src: planetSvg, type: IconType.icon },
  mail: { src: mailSvg, type: IconType.icon },
  arrowLeft: { src: arrowLeftSvg, type: IconType.icon },
  projects: { src: projectsSvg, type: IconType.icon },
  favourites: { src: favouritesSvg, type: IconType.icon },
  greenPending: { src: greenPendingSvg, type: IconType.icon },
  link: { src: linkSvg, type: IconType.icon },
  edit: { src: editSvg, type: IconType.icon },
  burned: { src: burnedSvg, type: IconType.icon },
  mask: { src: maskSvg, type: IconType.icon },
  time: { src: timeSvg, type: IconType.icon },
  auction: { src: auctionSvg, type: IconType.icon },
  wasteHandling: { src: wasteHandlingAndDisposalSvg, type: IconType.icon },
  transport: { src: transportSvg, type: IconType.icon },
  mining: { src: miningSvg, type: IconType.icon },
  metalProduction: { src: metalProductionSvg, type: IconType.icon },
  manufacturing: { src: manufacturingSvg, type: IconType.icon },
  livestock: { src: livestockSvg, type: IconType.icon },
  fugitiveEmissions: { src: fugitiveEmissionsSvg, type: IconType.icon },
  chemicalIndustry: { src: chemicalSvg, type: IconType.icon },
  energyDistribution: { src: energyDistributionSvg, type: IconType.icon },
  energyIndustries: { src: energyIndustriesSvg, type: IconType.icon },
  bridge: { src: bridgeSvg, type: IconType.icon },
  dex: { src: dexSvg, type: IconType.icon },
  explorer: { src: explorerSvg, type: IconType.icon },
};

interface IProps {
  icon?: Icons;
  src?: string;
  type?: IconType;
}

const IconSvg = ({ icon, src, type }: IProps) => {
  const iconRecord = icon ? icons[icon] : { src, type };

  switch (iconRecord.type) {
    case IconType.icon:
      return <Icon component={() => <img src={iconRecord.src} alt='' />} />;
    case IconType.img:
      return <img src={iconRecord.src} alt='' />;
    default:
      return <></>;
  }
};

export default memo(IconSvg);
