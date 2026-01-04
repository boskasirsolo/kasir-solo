
// This file is a wrapper. Implementation moved to components/services/index.tsx
import { 
    WebsiteServicePage as Web, 
    WebAppServicePage as App, 
    SeoServicePage as Seo, 
    MaintenanceServicePage as Maint 
} from '../components/services';

export const WebsiteServicePage = Web;
export const WebAppServicePage = App;
export const SeoServicePage = Seo;
export const MaintenanceServicePage = Maint;
