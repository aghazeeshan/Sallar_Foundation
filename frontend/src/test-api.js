// Test API connection
const testAPI = async () => {
    try {
        console.log('Testing API connection...');
        
        // Test banners API
        const response = await fetch('http://localhost:5000/api/banners');
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Banners API working:', data);
        } else {
            console.log('❌ Banners API failed:', response.status);
        }
        
        // Test blog API
        const blogResponse = await fetch('http://localhost:5000/api/blog/posts');
        if (blogResponse.ok) {
            const blogData = await blogResponse.json();
            console.log('✅ Blog API working:', blogData);
        } else {
            console.log('❌ Blog API failed:', blogResponse.status);
        }
        
    } catch (error) {
        console.error('❌ API connection failed:', error);
        console.log('Make sure backend is running on http://localhost:5000');
    }
};

// Export for use in components
export default testAPI;
