
import { LegalPage as LegalModule } from '../components/legal';
import { SiteConfig } from '../types';

export const LegalPage = ({ config }: { config?: SiteConfig }) => {
    return <LegalModule config={config} />;
};
