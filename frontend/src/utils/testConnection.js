// Test API connection
export const testAPIConnection = async () => {
    try {
        console.log('🔍 Testing API connection...');
        
        // Test banners API
        const bannerResponse = await fetch('http://localhost:5000/api/banners');
        if (bannerResponse.ok) {
            const banners = await bannerResponse.json();
            console.log('✅ Banners API working:', banners.length, 'banners found');
        } else {
            console.log('❌ Banners API failed:', bannerResponse.status);
        }
        
        // Test blog API
        const blogResponse = await fetch('http://localhost:5000/api/blog/posts');
        if (blogResponse.ok) {
            const posts = await blogResponse.json();
            console.log('✅ Blog API working:', posts.length, 'posts found');
        } else {
            console.log('❌ Blog API failed:', blogResponse.status);
        }
        
        return true;
    } catch (error) {
        console.error('❌ API connection failed:', error);
        console.log('Make sure backend is running on http://localhost:5000');
        return false;
    }
};

// Test banner service
export const testBannerService = async () => {
    try {
        const { bannerService } = await import('../services/bannerService');
        
        console.log('🔍 Testing Banner Service...');
        
        // Test get all banners
        const banners = await bannerService.getAllBanners();
        console.log('✅ Banner Service working:', banners.length, 'banners found');
        
        // Test get active banner
        const activeBanner = await bannerService.getActiveBanner();
        console.log('✅ Active Banner:', activeBanner ? 'Found' : 'None');
        
        return true;
    } catch (error) {
        console.error('❌ Banner Service failed:', error);
        return false;
    }
};
