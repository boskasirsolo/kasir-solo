
import { TARGET_CITIES } from '../data/constants';

export const getCityData = (slug: string) => {
  return TARGET_CITIES.find(c => c.slug === slug);
};
