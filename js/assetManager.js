class AssetManager {
    constructor() {
        this.cache = new Map();
        this.cacheDir = 'assets/cache/';
        this.compressionQuality = 0.7; // Default compression quality for images
    }

    async getCachedAsset(url) {
        const cachedPath = this.cacheDir + this.generateCacheKey(url);
        
        if (this.cache.has(url)) {
            return this.cache.get(url);
        }

        try {
            const response = await fetch(cachedPath);
            if (response.ok) {
                const blob = await response.blob();
                const objectUrl = URL.createObjectURL(blob);
                this.cache.set(url, objectUrl);
                return objectUrl;
            }
        } catch (error) {
            console.warn(`Cache miss for ${url}`, error);
        }

        // If cache miss, compress and cache the asset
        return await this.compressAndCacheAsset(url);
    }

    async compressAndCacheAsset(url) {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            
            if (blob.type.startsWith('image/')) {
                return await this.compressImage(blob, url);
            } else if (blob.type.startsWith('video/')) {
                return await this.compressVideo(blob, url);
            }
            
            // For other types, store as is
            const objectUrl = URL.createObjectURL(blob);
            this.cache.set(url, objectUrl);
            return objectUrl;
        } catch (error) {
            console.error(`Error compressing asset ${url}:`, error);
            return url; // Fallback to original URL
        }
    }

    async compressImage(blob, originalUrl) {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = URL.createObjectURL(blob);
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Set dimensions
                canvas.width = img.width;
                canvas.height = img.height;
                
                // Draw and compress
                ctx.drawImage(img, 0, 0);
                const compressedDataUrl = canvas.toDataURL('image/jpeg', this.compressionQuality);
                
                // Cache the compressed version
                this.cache.set(originalUrl, compressedDataUrl);
                
                // Save to cache directory
                this.saveToCache(compressedDataUrl, originalUrl);
                
                resolve(compressedDataUrl);
            };
        });
    }

    async compressVideo(blob, originalUrl) {
        // For videos, we'll just cache the original for now
        // Video compression would require a more complex solution
        const objectUrl = URL.createObjectURL(blob);
        this.cache.set(originalUrl, objectUrl);
        return objectUrl;
    }

    generateCacheKey(url) {
        // Create a unique filename for the cached asset
        return url.split('/').pop().replace(/[^a-zA-Z0-9]/g, '_');
    }

    async saveToCache(dataUrl, originalUrl) {
        try {
            const response = await fetch(dataUrl);
            const blob = await response.blob();
            
            // Save to cache directory using FileSystem API or similar
            // Note: This is a simplified version. In a real implementation,
            // you'd want to use proper file system operations
            const cacheKey = this.generateCacheKey(originalUrl);
            localStorage.setItem(cacheKey, dataUrl);
        } catch (error) {
            console.error('Error saving to cache:', error);
        }
    }

    clearCache() {
        this.cache.clear();
        localStorage.clear(); // Clear cached files
    }
}

// Export the AssetManager
window.AssetManager = AssetManager; 