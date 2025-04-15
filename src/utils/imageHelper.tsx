const imageProvider = import.meta.env.VITE_IMAGE_PROVIDER?.toLowerCase();
const cloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const cloudinaryTransformations = import.meta.env.VITE_CLOUDINARY_TRANSFORMATIONS || 'f_auto,q_auto'; // Default transformations
const s3UrlPrefix = import.meta.env.VITE_S3_URL_PREFIX;

/**
 * Generates the appropriate URL for an image based on the configured provider.
 * Assumes the 'imagePath' is the relative path used in Markdown,
 * which should correspond to the public ID in Cloudinary or the key in S3.
 * Example: "Neuroscience/assets/neuron.jpg"
 */
export function getImageUrl(imagePath: string, vaultId: string): string {
    // Basic cleanup: remove leading slash if present
    const cleanImagePath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    //console.log('Image provider is :', imageProvider); // Debugging
    if (imageProvider === 'cloudinary') {
        if (!cloudinaryCloudName) {
            console.warn("VITE_CLOUDINARY_CLOUD_NAME is not set.");
            return cleanImagePath; // Fallback or return placeholder
        }
        
        const publicIdPlusVault = `${vaultId}/images/${cleanImagePath}`; // Prepend vaultId to the image path

        //console.log('Resolved image path to Cloudinary:', publicIdPlusVault); // Debugging

        return `https://res.cloudinary.com/${cloudinaryCloudName}/image/upload/${cloudinaryTransformations}/${publicIdPlusVault}`;

    } else if (imageProvider === 's3') {
        if (!s3UrlPrefix) {
            console.warn("VITE_S3_URL_PREFIX is not set.");
            return cleanImagePath; // Fallback
        }
        // Construct S3 URL. Assumes S3 keys match the imagePath directly.
        // S3 doesn't do on-the-fly transforms via URL params like Cloudinary unless using CloudFront/Lambda@Edge.
         // Ensure no double slashes
         const prefix = s3UrlPrefix.endsWith('/') ? s3UrlPrefix : `${s3UrlPrefix}/`;
         // S3 keys are typically URL-safe, but full encoding might be safer depending on characters
         const encodedImagePath = cleanImagePath.split('/').map(encodeURIComponent).join('/');

        //console.log('Resolved image path to S3:', encodedImagePath); // Debugging
        return `${prefix}${encodedImagePath}`;

    } else {
        // Default/Fallback: Assume relative path within the site (or show warning)
        console.warn(`Unsupported VITE_IMAGE_PROVIDER: ${imageProvider}. Returning relative path.`);
        return cleanImagePath; // Or maybe prepend '/vaults/...' structure if needed for local fallback
    }
}